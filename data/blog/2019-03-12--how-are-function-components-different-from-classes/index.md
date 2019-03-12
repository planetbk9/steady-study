---
title: How Are Function Components Different from Classes?
createdDate: '2019-03-12'
updatedDate: '2019-03-12'
author: Ideveloper
tags:
  - react
image: welcoming.png
draft: false
---

리액트의 함수형 컴포넌트는 어떻게 리액트 클래스 컴포넌트와 다른가?

잠시동안, 정식으로 나온 답변들은 클래스는 (state와 같은) 많은 피쳐들에 접근할수 있게 한다는 것이었습니다. 훅과 함께면, 더이상 그것은 정답이 될수 없습니다.

아마 여러분들은 그것들중 하나는 성능상 좋다는 점을 들었을 것입니다. 어떤것인가요? 많은 벤치마크들은 결함이 있습니다, 그래서 저는 결론을 그려내는것에 주의하고있습니다. 성능은 주요하게 함수형을 선택하는가 클래스형을 선택하는가가 중요한게 아니라 여러분들의 코드가 어떻게 돌아가는지에 더 영향을 받습니다. 우리의 관찰결과, 성능차이는 무시할수 있고, 최적화 전략은 조금은 다릅니다.

이러한 케이스에서는 다른 이유가 없고, 얼리어답터가 되는걸 꺼려한다면 우리는 당신의 이미 존재하는 컴포넌트를 재작성 하는걸 추천하지 않습니다. 훅은 여전히 새로운것이고, 몇몇 best practice 들은 아직 그들의 tutorial들을 찾지 못했습니다.

그러면 우리는 어떤걸 해야 할까요? 리액트 function 컴포넌트와 클래스 컴포넌트의 근본적인 차이점들이 있나요? 물론입니다. Mental 모델에 있습니다. 이 포스트에선, 저는 가장 큰 그들의 차이점을 볼 것 입니다. 이것은2015년에 function 컴포넌트가 소개된 시점부터 존재했던것이나, 종종 간과되곤 합니다.

> 함수형 컴포넌트는 렌더되는 값들을 capture합니다.

이것은 어떤것을 의미하는지 파악해 봅시다.

* * *

Note: 이 post는 클래스 혹은 함수 기반 컴포넌트에서의 가치를 판단하는것이 아닙니다. 저는 오직 리액트에서의 두가지 모델을 비교하는것을 묘사하고 싶었습니다.

* * *

이 컴포넌트를 고려해 봅시다.

```javascript
function ProfilePage(props) {
  const showMessage = () => {
    alert("Followed " + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}
```