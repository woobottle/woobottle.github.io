---
title: 'native 로그인'
metaTitle: 'ios 개발중 오류 팁'
metaDescription: 'ios 개발중 오류 팁'
---

TL;DR:

- 웹뷰의 애플 로그인만 네이티브 로그인으로 구현합니다.

- 14.5.1 이상 버전에서는 apple sign in with js가 동작하지 않습니다. safari의 이슈 때문에 안되는것으로 추측합니다.

- 적용해주시고 예외상황이 발생한다면 말씀해주세요

- 안드로이드는 애플로그인 apple sign in with js로 잘 됩니다. ios쪽 부분만 네이티브로 변경합니다.

- apple login은 ios 13.0 이상에서만 가능합니다. 코드를 짜는데 애로사항이 계속 생겨서 패키징 파일의 최소 os 지원을 13으로 올려버렸습니다.

  <img src="https://user-images.githubusercontent.com/50283326/124374066-0f6ddb00-dcd3-11eb-856e-88a70f2873b2.png" alt="image" style="zoom:50%;" />

<br>

<br>

### 문제 원인 파악

apple sign in with js 에서는 로그인 시도시 **https://appleid.apple.com/auth/authorize?client_id=app.thankyounext.co.kr&redirect_uri=https%3A%2F%2Fapp.thankyounext.co.kr%2Fapple_redirect&response_type=code%20id_token&state=thankyounext_d6e9_sign_in&scope=name%20email&response_mode=form_post&frame_id=4d79987e-c911-4d67-be0d-b36e8863919c&m=32&v=1.5.3** 이 링크로 url을 이동시킵니다. 이후에 로그인 과정을 진행하게 됩니다.

이 링크가 크롬에서는 접속이 잘 되는데 safari에서는 load가 되지 않습니다.

정확한 원인은 잘 모르겠습니다.

(apple login을 gem으로도 시도 할수 있는데 해당 방식에서는 parameter로 더 많은 정보를 보내는것 같아서 시도해보신분 있으시면 말씀해주세요.)

ios의 realease notes 들을 확인해본 결과 해당 이슈가 이후의 버전에서 다뤄지고 있지 않은것 같아 네이티브로 선회 합니다.

<br>

<br>

### ruby 코드

컨트롤러에는 변경할 필요 없게끔 네이티브 코드 작성하였습니다.

로그인 하는 view 쪽에서만 네이티브쪽의 함수를 호출할 수 있도록 해주면 됩니다.

<br>

```ruby
# 애플 로그인 버튼 클릭하는 쪽
AppleID.auth.init({
      clientId : "app-ecm.dangtal.co.kr",
      scope : "name email",
      redirectURI: "https://app-ecm.dangtal.co.kr/apple_redirect",
      state : "app_ecm_apple_sign_in",
      nonce : "ecm_test",
    });

$("#apple_login").on("click", function() {
  if (app.device.android) {
    $("#appleid-signin").click();
  } else {
    try{
      webkit.messageHandlers.appleLoginButtonClick.postMessage('');
    } catch (err) {
      console.log('The native context does not exist yet');
    }
  }
})
```

<br>

원래 jwk url로 받아와서 검증을 하는 과정이 있어야 한다고 애플측에선 안내하지만

저희는 전달받은 params의 state가 application.html.erb에서 추가한 state와 같은 값인지만 파악하고 jwt를 decode한 결과값으로만 사용하고 있습니다.

<br>

아래는 각각의 상황에서 jwt를 decode한 값입니다.
아래는 이메일 가리기를 한 경우이고 같은 값의 이메일이 넘어오는걸로 확인하여 기존 디비와의 연동에도 문제가 없을것으로 판단하였습니다.
현재 구현한 프로젝트에서도 문제없이 로그인 되고 있습니다.
이쪽이 우려되는 바여서 혹시 로그인 한 후에 문제가 생긴다면 결과 공유 부탁드리겠습니다.

```ruby
sign in with js 방식에서 넘어온 jwt를 decode한 결과값 -> [{"iss"=>"https://appleid.apple.com",
"aud"=>"app-ecm.dangtal.co.kr", "exp"=>1625384344, "iat"=>1625297944, "sub"=>"001855.ea4580e8d02847c0af8d311b2071a341.0547",
"nonce"=>"ecm_test", "c_hash"=>"WRZafCYTDow_PekPvf6NGA", "email"=>"5bd927w4fg@privaterelay.appleid.com",
 "email_verified"=>"true", "is_private_email"=>"true", "auth_time"=>1625297944, "nonce_supported"=>true}, {"kid"=>"eXaunmL", "alg"=>"RS256"}]

sign in with native 방식에서 넘어온 jwt를 decode한 결과값 -> [{"iss"=>"https://appleid.apple.com", "aud"=>"kr.co.dangtal.app-ecm",
"exp"=>1625382129, "iat"=>1625295729, "sub"=>"001855.ea4580e8d02847c0af8d311b2071a341.0547", "c_hash"=>"opH_13A5G0u3fGXszh80Qg",
"email"=>"5bd927w4fg@privaterelay.appleid.com", "email_verified"=>"true", "is_private_email"=>"true", "auth_time"=>1625295729, "nonce_supported"=>true}, {"kid"=>"YuyXoY", "alg"=>"RS256"}]

```

<br>

<br>

### swift

1. Signing & Capabilities 에서 Sign in with Apple을 추가해 줍니다.
   <img src="https://user-images.githubusercontent.com/50283326/124374335-742a3500-dcd5-11eb-88c0-ca3f7d740269.png" alt="image" style="zoom:50%;" />

2. ViewController.swift

   ```swift
   import AuthenticationService


   class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler, ASAuthorizationControllerPresentationContextProviding, ASAuthorizationControllerDelegate {

     ~~~

     // 버튼을 눌렀을때 Apple 로그인을 모달 시트로 표시하는 함수
     @available(iOS 13.0, *)
      func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
          return self.webView.window!
      }

     // Apple ID 연동 성공 시
       @available(iOS 13.0, *)
       func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
           switch authorization.credential {
           // Apple ID
           case let appleIDCredential as ASAuthorizationAppleIDCredential:
               // 계정 정보 가져오기
               let userIdentifier = appleIDCredential.user
               let fullName = appleIDCredential.fullName
               let email = appleIDCredential.email

               if let authorizationCode = appleIDCredential.authorizationCode,
                  let identityToken = appleIDCredential.identityToken,
                  let authString = String(data: authorizationCode, encoding: .utf8),
                  let tokenString = String(data: identityToken, encoding: .utf8) {

                   let url = "\(Constant.baseURL)/apple/token"
                   var request = URLRequest(url: URL(string: "\(Constant.baseURL)/apple_redirect?state=app_ecm_apple_sign_in&id_token=\(String(data: identityToken, encoding: .utf8)!)")!)
                      request.httpMethod = "POST"
                   self.webView.load(request);
               }
             			// 원래 방식
                   // 클라이언트에서 identityToken을 서버로 전송
                   // 서버에서 이토큰을 가지고 "appleid.apple.com/auth/keys"
                   // 공개키를 이용해서 토큰을 복호화 하여 "developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens" 를 참고해서
                   // 애플에게 "https://appleid.apple.com/auth/token" 으로 유효성 검사를 요청하고 결과값을 이용해서 처리하는 식
               case let passwordCredential as ASPasswordCredential:
                   // Sign in using an existing iCloud Keychain credential.
                   let username = passwordCredential.user
                   let password = passwordCredential.password

                   print("username: \(username)")
                   print("password: \(password)")
               default:
                   break
           }
       }

   	// Apple ID 연동 실패 시
       @available(iOS 13.0, *)
       func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
           print("login failed")
       }

   	~~~

   	override func viewDidLoad() {

       ~~~

       let config = WKWebViewConfiguration()
       config.userContentController = {
           $0.add(self, name: "callbackHandler")
           $0.add(self, name: "registerSessionId")
         	// 코드 추가되는 부분
           $0.add(self, name: "appleLoginButtonClick")

           return $0
       }(WKUserContentController())

       ~~~

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
           switch message.name {
           case "callbackHandler":
               guard let userId = message.body as? String, let token = Utils.getUserValue("token") else { return }
               Utils.setUserValue("userId", userId)
               let url = "\(Constant.baseURL)/users/\(userId)/token?token=\(token)&device_type=ios&session_id=\(Utils.getUserValue("sessionId")!)"
               DispatchQueue.global().async {
                   Alamofire.request(url, method: .post, parameters: nil, encoding: JSONEncoding.default).response { d in
                   }
               }
           case "registerSessionId":
               guard let sessionId = message.body as? String else { return }
               Utils.setUserValue("sessionId", sessionId)
           // 코드 추가되는 부분
           case "appleLoginButtonClick":
               if #available(iOS 13.0, *) {
                   let appleIDProvider = ASAuthorizationAppleIDProvider()
                   let request = appleIDProvider.createRequest()
                   request.requestedScopes = [.fullName, .email]

                   let authorizationController = ASAuthorizationController(authorizationRequests: [request])
                   authorizationController.delegate = self
                   authorizationController.presentationContextProvider = self
                   authorizationController.performRequests()
               }
           default:
               ()
           }
       }

     }
   ```

   <br>

   <br>

### 안되면 저를 불러 주시거나 댓글로 남겨주세요. 모두 볼수 있게 공유하고자 합니다.

**월요일에 webapp-ios에 추가예정입니다.**
