---
title: 'jwt/jwk'
metaTitle: 'jwt/jwk'
metaDescription: 'jwt/jwk'
---

## jwt

* 필요한 모든 정보를 지니고 있습니다. 토큰에 대한 기본정보, 전달 할 정보, 토큰이 검증됐다는것을 증명해주는 signature

* 형태 : `head` +  "." + `payload` + "." +`signature` 

<br>

#### head -> 토큰의 타입 / 암호화 알고리즘 / Key id 

``` json
{
 	"typ": "JWT",
  "kid": "OEqNw5/eh+ga7bhB4C6XTX8ON0/8BqCJ26Q0htJ63WA=",
  "alg": "RS256"
}
```

<br>

#### payload -> data

* 정보의 조각을 클레임이라 호칭
* 등록된 클레임 + 공개 클레임 + 비공개 클레임
  * 등록된 클레임 -> 토큰에 대한 정보들을 담기 위하여 이미 정해진 클레임들 입니다.
  * 공개 클레임 -> 보통 URI형식으로 짓습니다.
  * 비공개 클레임 -> 클라이언트 <-> 서버 합의하에 생성하는 클레임 들입니다.

```json
{ 
  // 등록된 클레임 
  "sub": "9564265b-182f-4b7f-b939-45c60c0b91f7", // 토큰 제목
  "iss": "https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_A7xpHDFAK", // 토큰 발급자
  "iat": 1625144429, // 토큰이 발급된 시간
  "exp": 1625148029, // 토큰의 만료 시간
  "jti": "8957ae05-e450-460d-997f-cdc4c8ae6573", // JWT의 고유 식별자
  // 공개 클레임 
  "https://velopert.com/jwt_claims/is_admin": true,
  // 비공개 클레임
  "event_id": "893a4c1b-3d67-4b8d-a57f-4ed8bcf90c6c", 
  "token_use": "access",
  "scope": "aws.cognito.signin.user.admin",
  "auth_time": 1625144429,
  "client_id": "79307ehbtr2o3ln1ip8dcb9v6p",
  "username": "9564265b-182f-4b7f-b939-45c60c0b91f7",
}
```

<br>

#### signature (서명)

헤더의 인코딩 값과 payload의 인코딩값을 합한후 주어진 비밀키로 해쉬를 하여 생성합니다

이때 인코딩은 base64 인코딩을 합니다.

해당 메시지가 변조되지 않았는지 확인하기 위해 서명이 필요하고 대칭키 방식 혹은 비대칭키 방식을 이용합니다.

<br>

**RS256(RSA Sinature with SHA-256)**

* 비대칭키 방식

* message에 sha-256 적용후 private_key 사용해서 암호화

* public key는 jwk를 통해 공개적으로 제공

  <img width="326" alt="Screen Shot 2021-07-02 at 9 48 30 AM" src="https://user-images.githubusercontent.com/72545732/124208274-2ae5b400-db22-11eb-8003-924b44b316f6.png">

  
<br>

**HS256(HMAC with SHA-256)**

* 대칭키 방식

* message에 sha-256 적용후 대칭키 사용해서 암호화

* 토큰을 만들때 사용한 secret_key와 토큰을 검증할때 사용하는 secret_key가 같아야 합니다.

  <img width="319" alt="Screen Shot 2021-07-02 at 9 48 49 AM" src="https://user-images.githubusercontent.com/72545732/124208317-3fc24780-db22-11eb-936c-c9168de505b8.png">


<br>

## jwk (JSON Web Key)

* [이전 영보님 글](https://insomenia.com/posts/356)

* 암호화 키를 표현하기 위한 JSON 객체에 관한 표준입니다.

* AWS Cognito 서비스에서는 JWT를 서명하는데 사용했던 **public key를 제공** 하기위해 JWK에 접근할수 있는 URL을 제공합니다. URL에서는 아래와 같은 형태로 key를 다운로드 할수 있습니다.

  https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json. [참고링크](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html) 

```json
 keys: [
   {
     alg: 어떤 알고리즘을 사용하는지
     e: RSA public exponent,
     kid: Key ID,
     kty: Key Type(RSA or EC(Elliptic Curve)),
     n: RSA modulus,
     use: (Public Key Use) -> 퍼블릭 키가 어떤 용도로 사용되는지 명시 ("sig"(signature) or "enc"(encryption))
   }, 
		~~~
 ]

```

<br>

#### jwt + jwk 사용 흐름 입니다.

1. 프론트에서 서버로 Aws Cognito에서 전달받은 토큰을 헤더에 포함하여 보냅니다
2. 서버에서는 헤더에 포함된 토큰의 유효성 검증을 jwk 형식의 public key를 이용하여 서명의 일치 여부를 파악합니다.
3. 서명이 일치하면 토큰에서 user의 정보를 가져옵니다.

<br>

#### aws cognito 문서의 json 웹 토큰 확인 흐름입니다.

1단계: JWT 구조 확인
	1-1. 헤더.payload.signature의 구조가 아니면 유효하지 않은것으로 간주하고 수락하지 않습니다.



2단계: JWT 서명 검증

​	2-1. api서버에서 jwt를 디코딩 합니다.

​	2-2. user_pool의 public json web key(jwk)를 다운로드하고 저장합니다. 

​	2-3. jwt의 header에 포함된 kid와 jwk의 kid가 일치하는지 확인합니다. 



3단계: 클레임 

​	3-1. 토큰이 만료되지는 않았는지 키의 페이로드에 포함된 발행자는 사용자 풀과 일치하는지 확인합니다. 	

<br>
<br>

### 현재 루비에서 JWK를 사용하는 부분입니다.

이 글을 쓰게된 주요 원인입니다. 아래 두개의 메소드가 값은 값을 반납하여 혼란이 생겼었습니다.

Gem을 까보았고 검증을 하는것과 안하는것의 차이로 이해하였습니다.

```ruby
def payload
   JWT.decode jwt_token, nil, true, { algorithms: [alg], jwks: jwks } -> 알고리즘과 jwk를 이용하여 해당 토큰에 대한 검증을 진행, 이상 없으면 이후의 과정 진행
end
```



```ruby
def claimless_payload
   JWT.decode jwt_token, nil, false -> 토큰을 base64 디코드만 진행
end
```



위의 코드는 jwk가 jwt를 암호화 한 퍼블릭 키와 같을때만 같은값을 반납합니다.



jwk를 다른 jwk를 넣어줄 경우 아래와 같은 결과 값을 리턴합니다.

```ruby
*** JWT::DecodeError Exception: Could not find public key for kid OEqNw5/eh+ga7bhB4C6XTX8ON0/8BqCJ26Q0htJ63WA=
```

<br>

GEM 내의 코드를 확인해 보겠습니다.

```ruby
# lib/jwt.rb

def decode(jwt, key = nil, verify = true, options = {}, &keyfinder)
  Decode.new(jwt, key, verify, DEFAULT_OPTIONS.merge(options), &keyfinder).decode_segments
end


# lib/jwt/decode.rb
# frozen_string_literal: true

require 'json'

require 'jwt/signature'
require 'jwt/verify'
# JWT::Decode module
module JWT
  # Decoding logic for JWT
  class Decode
    def initialize(jwt, key, verify, options, &keyfinder)
      raise(JWT::DecodeError, 'Nil JSON web token') unless jwt
      @jwt = jwt
      @key = key
      @options = options
      @segments = jwt.split('.')
      @verify = verify
      @signature = ''
      @keyfinder = keyfinder
    end

    def decode_segments
      validate_segment_count!
      if @verify
        decode_crypto
        verify_signature
        verify_claims
      end
      raise(JWT::DecodeError, 'Not enough or too many segments') unless header && payload
      [payload, header]
    end

    private
    
		# 생략
    
    def header
      @header ||= parse_and_decode @segments[0]
    end

    def payload
      @payload ||= parse_and_decode @segments[1]
    end

    def signing_input ~ end

    def parse_and_decode(segment)
      JWT::JSON.parse(JWT::Base64.url_decode(segment))
    rescue ::JSON::ParserError
      raise JWT::DecodeError, 'Invalid segment encoding'
    end
  end
end

```

<br>

**잘못된 정보가 있으면 슬랙이나 댓글로 남겨주세요. 확인하는대로 반영 및 수정 하겠습니다!**

<br>

출처 :   https://velopert.com/2389,

​            https://www.letmecompile.com/api-auth-jwt-jwk-explained/

​			https://docs.aws.amazon.com/ko_kr/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html