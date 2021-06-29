---
title: 'All WebView Methods Must Be Called On The Same Thread'
metaTitle: 'android/java'
metaDescription: 'android/java'
---

리액트에서 fcm 전송에 필요한 토큰을 네이티브쪽으로 요청할때 
`All WebView Methods Must Be Called On The Same Thread` 와 같은 에러가 프론트 쪽에서 발생해 요청이 가지 않는 현상이 있었습니다.

이전에 리액트가 아닌 자바스크립트에서는 발생하지 않았던 현상으로 원인이 리액트 쪽에 있는 것인지는 파악을 해봐야 합니다.
이를 해결하기 위해서는 android 패키징 파일 내에서 `Javascript Interface`를 통해 메소드를 호출할때 쓰레드를 `Runnable`로 생성해주고 그 안에서 처리를 해주면 됩니다.

```java
public void METHOD_NAME() {
  webview.post(new Runnable() {
    @Override
    public void run() {
      // METHOD 실행
    }
  })
}
```