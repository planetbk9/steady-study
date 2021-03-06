---
title: 엔터티와 인코딩
createdDate: "2020-01-04"
updatedDate: "2020-01-04"
author: Ideveloper
tags:
  - network
image: entity.png
draft: false
---

 `이 글은 HTTP 완벽가이드 15장을 참고해 정리한 포스팅입니다.`

## 시작하기에 앞서

HTTP는 콘텐츠를 나르기 위한 잘 라벨링된 **엔티티**를 사용합니다.

이 글에서는 아래 내용들을 다루게 됩니다.
- HTTP 데이터를 담는 컨테이너인 `HTTP 메시지 엔터티`의 포맷과 동작방식
- HTTP가 엔터티 본문의 크기를 기술하는 방법
- 클라이언트가 콘텐츠를 바르게 처리할 수 있도록 제공되는 엔터티 헤더들
- 공간을 적게, 안전하게 만들기 위해 하는 콘텐츠 인코딩
- HTTP 데이터를 실어 나르는 방식을 수정하는 전송 인코딩, 길이를 알수 없는 콘텐츠를 안전하게 전송하기 위해 여러조각으로 쪼개 전달하는 청크 인코딩
- 클라이언트가 요청한 콘텐츠의 최신버전을 가져올수 있도록 도와주는 태그, 라벨, 시간, 체크섬 모음
- 콘텐츠 버전번호처럼 동작하는 검사기들과 객체를 최신으로 유지하기 위해 설계된 HTTP 헤더들
- 중단되었던 다운로드를 중단된 지점에서부터 재개하고자 할때 유용한 델타인코딩

---

## 메시지는 컨테이너, 엔터티는 화물 📦

- HTTP 메시지를 인터넷 운송 시스템의 `컨테이너` 라고 생각한다면, HTTP 엔터티는 메시지의 실질적인 `화물`입니다.
- 엔터티 본문은 가공되지 않은 데이터만을 담고 있습니다.
- 엔터티 본문은 날데이터 이기 때문에 엔터티 헤더는 데이터의 의미에 대해 설명할 필요가 있습니다.
- HTTP 엔터티 헤더는 아래와 같은 10가지 주요 엔터티 헤더 필드를 정의하였습니다.

  **Content-Type**
  - 엔터티에 의해 전달된 객체의 종류

  **Content-Length**
  - 전달되는 메시지의 길이나 크기

  **Content-Language**
  - 전달되는 객체와 가장 잘 대응하는 자연어

  **Content-Encoding**
  - 객체 데이터에 대해 행해진 변형(압축 등)

  **Content-Location**
  - 요청 시점을 기준으로, 객체의 또 다른 위치

  **Content-Range**
  - 만약 이 엔터티가 부분 엔터티라면, 이헤더는 이 엔터티가 전체에서 어느 부분에 해당하는지 정의

  **Content-MD5**
  - 엔터티 본문의 콘텐츠에 대한 체크섬

  **Last-Modified**
  - 서버에서 이 콘텐츠가 생성 혹은 수정된 날

  **Expires**
  - 이 엔터티 데이터가 더 이상 신선하지 않은 것으로 간주되기 시작하는 날짜와 시각

  **Allow**
  - 이 리소스에 대해 어떤 요청 메서드가 허용 되는지

  **ETag**
  - 이 인스턴스에 대한 고유한 검사기
  - 엔터티 헤더로 정의되어 있지는 않음

  **Cache-Control**
  - 어떻게 이 문서가 캐시될 수 있는지에 대한 지시자
  - 엔터티 헤더로 정의되어 있지는 않음

![image](https://user-images.githubusercontent.com/26598542/71766925-d66f7180-2f48-11ea-8caa-05d458b52ca1.png)

--- 

## 엔터티의 길이 (Content-Length) 📏
- Content-Length 헤더는 메시지의 엔터티 본문의 크기를 바이트 단위로 나타냅니다.
  - gzip으로 압축된 텍스트 파일이라면 원래 크기가 아닌 압축후의 크기입니다.
- Content-Length 헤더는 메시지를 청크 인코딩으로 전송하지 않는 이상, 엔터티 본문을 포함한 메시지에서는 필수적으로 있어야 합니다. 

### 잘림 검출
- Content Length가 없다면 클라이언트는 커넥션이 정상적으로 닫힌것인지 메시지 전송중에 충돌이 발생한 것인지 구분하기 어렵습니다. 따라서 이러한 메시지 잘림 검출을 하기 위해 Content-Length를 필요로 하게 됩니다.
- 잘린 메시지 캐시 위험을 줄이기 위해 캐싱 프락시 서버는 Content-Length 헤더를 갖고 있지 않은 HTTP 본문은 보통 캐시하지 않습니다.

### Content-Length와 지속 커넥션
- Content-Length는 지속 커넥션을 위해 필수입니다.
  - Content-Length 헤더 없이는 어디까지가 엔터티 본문이고 어디부터가 다음 메시지인지 알수 없을 것이기 때문입니다.
- 청크인코딩은 데이터를 각각이 특정한 크기를 갖는 일련의 청크들로 쪼개 보내기 때문에 `Content-Length 헤더 없는 지속 커넥션`을 만나는 유일한 상황입니다.

### 콘텐츠 인코딩
- HTTP는 `보안을 강화`하거나 `압축을 통해 공간을 절약할 수 있도록`할때 엔터티 본문을 인코딩할수 있게 해도록 해줍니다.
- 이때 Content-Length 헤더는 인코딩 되지 않은 원본의 길이가 아닌 인코딩 된 본문의 길이를 바이트 단위로 정의하게 됩니다.

---

## 엔터티 요약 🔑
- HTTP가 일반적으로 TCP/IP와 같이 신뢰할 만한 전송 프로토콜 위에서 구현됨에도 불구하고 여러가지 이유로 메시지의 일부분이 전송 중에 변형되는 일이 일어납니다.
- 엔터티 본문 데이터에 대한 의도치않은 변경을 감지하기 위해 최초엔터티가 생성될때 송신자는 데이터에 대한 체크섬을 생성할 수 있고, 수신자는 그체크섬으로 변경을 잡아내는 검사를 할 수 있습니다.
- `Content-MD5` 헤더는 서버가 엔터티 본문에 MD5 알고리즘을 적용한 결과를 보내기 위해 사용됩니다. 
- 그러나 여러 활용가치에도 불구하고, Content-MD5 헤더는 자주 전송되지는 않습니다. 
  
---

## 미디어 타입과 Charset 💽

- Content-Type 헤더는 본문의 MIME 타입을 기술하게 됩니다.
  - MIME 타입은 전달되는 매체의 기저형식(HTML, 워드,MPEG..ETC) 의 표준화된 이름입니다.
  - 클라이언트 애플리케이션은 콘텐츠를 적절히 해독하고 처리하기 위해 MIME 타입을 이용하게 됩니다.
- `MIME` 타입은 주 미디어 타입(텍스트,이미지,오디오) 로 시작해서 뒤이어 빗금 (/), 그리고 미디어 타입을 더 구체적으로 서술하는 부타입(subtype) 으로 구성됩니다.

mime타입

| 미디어 타입                        |                            설명                            |
| :---------------------------- | :------------------------------------------------------: |
| text/html                     |                      엔터티 본문은 HTML문서                      |
| text/plain                    |                    엔터티 본문은 플레인 텍스트 문서                    |
| image/gif                     |                     엔터티 본문은 gif 이미지                      |
| image/jpeg                    |                     엔터티 본문은 jpeg 이미지                     |
| audio/x-wav                   |                  엔터티 본문은 wav 음향 데이터를 포함                  |
| model/vml                     |                   엔터티 본문은 삼차원 VRML 모델                    |
| application/vnd.ms-powerpoint |               엔터티 본문은 마이크로소프트 파워포인트 프레젠테이션               |
| multipart/byteranges          | 엔터티 본문은 여러 부분으로 나뉘는데, 각 부분은 전체 문서의 특정 범위(바이트 단위)를 담고 있다. |
| message/http                  |         엔터티 본문은 완전한 HTTP메시지를 담고 있다. (TRACE 메서드)          |

- Content-Type 헤더는 콘텐츠 인코딩을 거친 경우에도 인코딩 전의 엔터티 본문의 유형을 명시할것이기 때문에 중요합니다.
  
### 텍스트 매체를 위한 문자 인코딩
- Content-Type 헤더는 내용 유형을 더 자세히 지정하기 위한 선택적 매개변수도 지원하게 됩니다.
- charset 매개변수가 그 대표적인 예입니다.
  - 앤터티의 비트 집합울 텍스트 파일의 글자들로 변환하기 위한 매개변수
```
Content-Type: text/html; charset=iso-8859-4
```

---

## 콘텐츠 인코딩 🛠

- 서버는 전송시간을 줄이기 위해 콘텐츠를 압축할 수 있습니다.
- 이러한 종류의 인코딩은 발송하는 쪽에서 콘텐츠에 적용하게 됩니다.

### 콘텐츠의 인코딩 과정
1. 웹서버가 원본 Content-Type 과 Content-Length 헤더를 수반한 원본 응답 메시지를 생성합니다.
2. 콘텐츠 인코딩 서버가 인코딩된 메시지를 생성합니다. 인코딩된 메시지는 Content-Type은 같지만 Content-Length 는 다릅니다. 콘텐츠 인코딩 서버는 `Content-Encoding` 헤더를 인코딩된 메시지에 추가해 수신측에서 디코딩할수 있도록 합니다.
3. 수신 측에서 디코딩해 원본을 얻습니다.

![image](https://user-images.githubusercontent.com/26598542/71767581-ebe89980-2f50-11ea-80e8-05a2fb1aab98.png)

### 콘텐츠 인코딩 유형

- 콘텐츠 인코딩 유형은 아래 몇가지 토큰들을 활용하게 됩니다.
  - gzip (일반적으로 가장 효율적이고 가장 널리 쓰이는 압축 알고리즘)
  - compress
  - deflate
  - identity (Content Encoding 헤더가 없다면 이값인 것으로 간주)

### Accept-Encoding 헤더
- 클라이언트는 자신이 지원하는 인코딩의 목록을 Accept-Encoding 헤더를 통해 전달합니다.
- Q(quality) 값을 매개변수로 더해 선호도를 나타낼수도 있습니다.

```
Accept-Encoding: compress,gzip
Accept-Encoding: *
Accept-Encoding: compress;q=0.5, gzip;1.0
```
---

## 전송 인코딩과 청크 인코딩 🗝
- 전송 인코딩 또한 엔터티 본문에 적용되는 변환히지만, 구조적인 이유 때문에 적용되는 것이며 콘텐츠의 포맷과는 독립적입니다.
- 메시지 데이터가 네트워크를 통해 전송되는 방법을 바꾸기 위해 전송 인코딩을 메시지에 적용할 수 있습니다.
- 콘텐츠 인코딩은 단지 메시지의 엔터티 본문만 인코딩하지만, `전송인코딩` 에서는 인코딩 전체 메시지에 대해 적용되며 메시지 전체 구조를 바꾸게 됩니다.

![image](https://user-images.githubusercontent.com/26598542/71767744-ae850b80-2f52-11ea-8794-e57ee7e2e8fd.png)

### Transfer-Encoding 헤더
- 전송 인코딩을 제어하고 서술하기 위해 정의된 헤더는 단 두개 뿐입니다.

Transfer-Encoding
- 안전한 전송을 위해 어떤 인코딩이 메시지에 적용되었는지 수신자에게 알려줍니다.
TE
- 어떤 확장된 전송 인코딩을 사용할 수 있는지 서버에게 알려주기 위해 요청 헤더에서 사용하게 됩니다.

```
//클라이언트가 서버에게 TE헤더를 사용해 요청
GET /new/blog.html HTTP/1.1
Host: www.ideveloper2.dev
User-Agent: Mozilla/4.61 [en]
TE: trailers, chunked

// 수신자에게 전송 인코딩 정보를 알려줌
HTTP/1.1 200 OK
Transfer-EncodingL chunked
Server: Apache/3.0

```

###  청크 인코딩
- 청크 인코딩은 메시지를 일정 크기의 청크 여럿으로 쪼개게 됩니다.
- 청크 인코딩은 전송 인코딩의 한 형태이며 따라서 본문이 아닌 메시지의 속성입니다.
- 청크 분할 인코딩은 더 많은 양의 데이터가 클라이언트에 전송되고 요청이 완전히 처리되기 전까지는 응답의 전체 크기를 알지 못하는 경우 유용하다. 데이터베이스 쿼리의 결과가 될 큰 HTML 테이블을 생성하는 경우나 큰 이미지를 전송하는 경우가 그 예입니다. 청크 분할 응답은 다음과 같습니다.

```
HTTP/1.1 200 OK 
Content-Type: text/plain 
Transfer-Encoding: chunked

7\r\n
Mozilla\r\n 
9\r\n
Developer\r\n
7\r\n
Network\r\n
0\r\n 
\r\n
```

### 전송 인코딩의 규칙
- 전송 인코딩의 집합은 반드시 chunked를 포함해야 합니다.
- 청크 전송 인코딩이 사용되었다면, 메시지 본문에 적용된 마지막 전송 인코딩이 존재해야 합니다.
- 청크 전송 인코딩은 반드시 본문에 한번이상 적용되어야 합니다.
- 전송인코딩은 HTTP1.1에서 소개된 비교적 새로운 기능이며, 비 HTTP1.1 애플리케이션에 전송 인코딩된 메시지를 보내지 않도록 주의해야합니다.

---

## 검사기와 신선도 🔎

- 조건부 요청이라 불리는 특별한 요청은, 클라이언트가 서버에게 자신이 갖고 있는 버전을 말해주고 검사기를 사용해 자신의 사본 버전이 더 이상 유효하지않을 때만 사본을 보내달라고 요청하는 것입니다. 이떄 필요한 세가지 주요개념 **(신선도, 검사기, 조건)** 에 대해서 알아봅시다.

### 신선도

- 서버는 클라이언트에게 얼마나 오랫동안 콘텐츠를 캐시하고 그것이 신선하다고 가정할수 있는지에 대한 정보를 줄것 입니다.
- 서버는 `Expires`나 `Cache-Control` 헤더를 통해 이러한 정보를 제공할 수 있습니다.

**Expires**
- Expires 헤더는 문서가 만료되어 더이상 신선하다고 간주할 수 없게 되는 정확한 날짜를 명시하게 됩니다.
- 바르게 사용하는 클라이언트나 헤더는 시계를 반드시 동기화 시켜야 합니다. 따라서 상대시간을 이용해 만료를 정의하는 매커니즘 (Cache-control)이 더 쓸만합니다.
```
Expires: Sun Mar 18:23:59:59 GMT 2020
```

**Cache-Control**
- 문서의 최대 수명을 문서가 서버를 떠난 후로부터의 총 시간을 초 단위로 정하게 됩니다.
- 단지 수명이나 유효기간 뿐만아니라, 신선도를 서술하기 위해 사용하게 됩니다.

아래는 Cache-Control 헤더에 동반될 수 있는 지시자들입니다.

`요청관련`

| 지시자            | 메시지 타입 |                             설명                             |
| :------------- | :----- | :--------------------------------------------------------: |
| no-cache       | 요청     |                서버와의 최초 재검사 없이는 캐시된 사본 반환 x                 |
| no-store       | 요청     |               문서의 캐시된 사본을 반환 x 서버로부터 응답 저장 x               |
| max-age        | 요청     |                 캐시의 문서는 명시한 나이보다 오래되어서는 x                  |
| max-stale      | 요청     | 문서는 서버가 정해준 만료일이 지나더라도 지난 시간이 이 지시자로 지정한 시간보다 크지않다면 받아들인다. |
| min-fresh      | 요청     |          문서의 신선도 수명이 그 문서의 나이에 이 값을 더한것보다 작아서는 x           |
| no-transform   | 요청     |                    문서는 보내기 전에 변형되어서는 x                     |
| only-if-cached | 요청     |             서버에 접근하지 말고, 캐시에 들어있는 경우에만 문서를 보내라             |

`응답 관련`

| 지시자              | 메시지 타입 |                                            설명                                            |
| :--------------- | :----- | :--------------------------------------------------------------------------------------: |
| public           | 응답     |                                    응답은 어떤 캐시로든 캐시된다.                                     |
| private          | 응답     |                            응답은 하나의 클라이언트만 접근할 수 있는 형태로 캐시된다.                             |
| no-cache         | 응답     | 헤더 필드의 목록을 동반하고 있다면 콘텐츠는 캐시되어 제공될수 있지만, 헤더필드가 지정되지 않았다면 절대 캐시된 사본은 서버를 통한 재검사 없이 제공되어선 x |
| no-store         | 응답     |                                     응답은 절대로 캐시되어서는 x                                     |
| no-transform     | 응답     |                                    응답은 제공되기 전까진 수정 x                                     |
| must-revalidate  | 응답     |                                 응답은 반드시 제공되기전 서버를 통해 재검사                                 |
| proxy-revalidate | 응답     |                               공유된 캐시는 반드시 응답을 원서버를 통해 재검사                                |
| max-age          | 응답     |                          문서가 캐시될수 있고 신선하다고 간주될수 있는 시간의 최대길이 정의                           |
| s-max-age        | 응답     |                        공유된 캐시에 적용될수 있는 문서의 최대 수명 정의 (max-age 덮어씀)                        |

### 조건부 요청과 검사기

- HTTP는 클라이언트에게 리소스가 바뀐 경우에만 사본을 요청하는 `조건부 요청`이라 불리는 특별한 요청을 할 수 있는 방법을 제공합니다.
- 조건부 요청은 특정 조건이 참일때에만 수행됩니다.
- 조건부 요청은 `If-` 로 시작하는 조건부 헤더에 의해 구현됩니다.
- 만약 조건이 참이 아니라면 HTTP 에러 코드를 돌려보냅니다.
- `Last-Modified`와 `ETag`는 HTTP에 의해 사용되는 두개의 주요한 검사기입니다.

**조건부 요청 헤더에 사용되는 네가지 헤더**

| 요청 유형               | 검사기           |                                        설명                                        |
| :------------------ | :------------ | :------------------------------------------------------------------------------: |
| If-Modified-Since   | Last-Modified | 지난번 Last-Modified 응답 헤더에 들어있었던 시각에 마지막으로 수정된 버전이 더이상 최신 버전이 아니라면 그 리소스의 사본을 보내라. |
| If-Unmodified-Since | Last-Modified |    지난번 Last-Modified 웅덥 헤더에 들어있었던 시각에 마지막으로 수정된 버전에서 변한게 없다면 그 리소스의 사본을 보내라.     |
| If-Match            | ETag          |               지난번 ETag 응답 헤더에 들어있었던 것과 엔터티 태그가 같다면 그 리소스의 사본을 보내라                |
| If-None-Match       | ETag          |               지난번 ETag 응답 헤더에 들어있었던 것과 엔터티 태그가 다르다면 그 리소스의 사본을 보내라               |

- HTTP는 검사기를 **약한 검사기**와 **강한 검사기** 두가지로 분류하게 됩니다.
- 약한 검사기는 리소스의 인스턴스를 고유하게 식별하지 못하는 경우가 있는 반면 강한 검사기는 언제나 고유하게 식별하게 됩니다.
  - 약한 검사기 : 최종 변경 시각, 객체의 바이트 단위 크기
  - 강한 검사기 : ETag (매 변경마다 구분값을넣어주므로)
- 서버는 태그앞에 `W/`를 붙임으로써 약한 엔터티 태그임을 알릴 수 있습니다.
- 강한엔터티 태그는 관련된 값이 아무리 사소하게 바뀌더라도 함께 변경되어야 합니다.

---

## 범위 요청 🤝
- HTTP 클라이언트는 받다가 실패한 엔터티를 일부 혹은 범위로 요청함으로써 다운로드를 중단된 시점에서 재개할 수 있습니다.
- Range 헤더를 통해 여러 범위로 요청을 하기 위해 사용할 수 있습니다.
  - 이 range 헤더는 peer to peer 파일 공유 클라이언트가 멀티미디어 파일의 다른 부분을 다른 피어로부터 동시에 다운로드 받을때 널리 사용됩니다.
  - 모든 서버가 범위 요청을 받아 들일수 있는 것은 아니지만 서버가 응답으로 Accept-Range 헤더를 포함시키는 방법으로 알려줄수 있습니다.
  - `ex) Accept-Ranges: bytes`
- 범위 요청은 객체의 특정 인스턴스를 클라이언트와 서버 사이에서 교환 하는 것이기 때문에 인스턴스 조작의 일종이라는 것에 주의해야 합니다.

엔터티 범위 요청의 예
![image](https://user-images.githubusercontent.com/26598542/71768615-edb75a80-2f5a-11ea-9b08-47ce75120ff9.png)

---

## 델타 인코딩 ⚙️
- 새 페이지를 전체를 보내는 대신 페이지에 대한 클라이언트의 사본에 대해 변경된 부분만을 서버가 보낸다면 클라이언트는 더 빨리 페이지를 얻을수 있습니다.
- 델타 인코딩은 객체 전체가 아닌 `변경된 부분`에 대해서만 통신하여 전송량을 최적하 하는 HTTP 프로토콜의 확장입니다. 
- 델타 인코딩은 전송 시간을 줄일 수 있지만 구현하기가 까다로울 수 있습니다.
  - 문서를 제공하는데 걸리는 시간이 줄어든 대신, 서버는 문서의 과거 사본을 모두 유지하기 위해 디스크 공간을 더 늘려야 합니다. 이는 전송량 감소로 얻은 이득을 금방 무의미하게 만들수 있습니다.

델타 인코딩 관련 헤더들

| 헤더            |                                            설명                                             |
| :------------ | :---------------------------------------------------------------------------------------: |
| ETag          |            문서의 각 인스턴스에 대한 유일한 식별자. 다음번 요청에서 If-Match와 If-None-Match 헤더에서 사용한다             |
| If-None-Match |                 클라이언트가 보내는 요청 헤더로, 서버가 클라이언트와 다른 버전의 문서를 갖고 있는 경우에 한해 요청                  |
| A-IM          |                          받아 들일 수 있는 인스턴스 조작의 종류를 가리키는 클라이언트 요청헤더                          |
| IM            |                            요청에 적용된 인스턴스 조작의 종류를 명시하는 서버 응답 헤더                             |
| Delta-Base    | 델타를 생성하기 위해 사용된 기저 문서의 ETag(클라이언트 요청의 If-None-Match헤더에 들어있는 ETag와 같아야 한다.)를 명시하는 서버 응답 헤더 |