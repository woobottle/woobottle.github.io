---
title: "mac 환경설정하기"
metaTitle: "This is the title tag of this page"
metaDescription: "This is the meta description"
---

  터미널에서 명령어를 실행하는 것은 결국 파일을 실행하는 것이다.
  명령어 입력시에 환경변수에 잡혀있는 path를 따라가서 해당파일을 실행하는 원리로 명령어는 작동된다(참고의 글쓴이분 감사합니다!)
  

  임시로 path 추가하기
    ```sh
      export path = "test/bin"
    ```
    명령어로 일시적으로 path에 추가할수 있다.
    터미널을 종료 하였다가 켜면 path에서 사라진다.

  영구적 path 추가하기
    /etc/path에서 bin 파일 추가해주기

    sudo vim /etc/paths
    ![image](https://user-images.githubusercontent.com/50283326/114293525-d22dee80-9ad1-11eb-9156-f48f1a4b65ac.png)


    그리고 추가한 bin 경로 안의 파일을 실행시킬수 있다.

    참고 : https://m.blog.naver.com/occidere/220821140420