// 1. Firebase 구성 설정 (본인의 Firebase 콘솔에서 복사한 것으로 교체하세요)
const firebaseConfig = {
    apiKey: "AIzaSyBsHbosmYs7U8y6uDuYeRaibMVoAx8-fQ4",
    authDomain: "quiz-d2d9a.firebaseapp.com",
    databaseURL: "https://quiz-d2d9a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quiz-d2d9a",
    storageBucket: "quiz-d2d9a.firebasestorage.app",
    messagingSenderId: "114749518417",
    appId: "1:114749518417:web:44300ef313bb69aae2fe70",
    measurementId: "G-JE0WRL45DK"
  };

// Firebase 초기화 (v9 compat 방식)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 사용자 식별 (로그인 기능이 없으므로 브라우저별 고유 ID 생성)
let userId = localStorage.getItem('quiz_user_id');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('quiz_user_id', userId);
}

// 2. 퀴즈 데이터 (객관식 50개 + 단답형 50개 = 총 100개)
const quizData = [
    // [객관식 50문제]
    { type: 'choice', q: "변수의 특징으로 옳지 않은 것은?", a: ["메모리 공간", "값 변경 불가", "재사용 가능", "자료형 결정"], c: 1, r: "변수는 값을 변경할 수 있습니다." },
    { type: 'choice', q: "Python의 타이핑 방식은?", a: ["정적", "강타입", "동적", "약타입"], c: 2, r: "실행 시 결정되는 동적 타이핑입니다." },
    { type: 'choice', q: "C#에서 같은 어셈블리 내 접근 제한자는?", a: ["public", "private", "internal", "protected"], c: 2, r: "internal은 동일 어셈블리 내에서 접근 가능합니다." },
    { type: 'choice', q: "Python LEGB 규칙 중 'E'는?", a: ["External", "Enclosing", "Entry", "Else"], c: 1, r: "Enclosing(중첩 함수 범위)입니다." },
    { type: 'choice', q: "순수 함수의 특징은?", a: ["상태 변경 중심", "부수 효과 없음", "매개변수 없음", "랜덤 결과"], c: 1, r: "동일 입력-동일 출력, 부수 효과가 없습니다." },
    { type: 'choice', q: "객체지향 4대 원칙이 아닌 것은?", a: ["캡슐화", "상속", "컴파일", "추상화"], c: 2, r: "캡슐화, 상속, 다형성, 추상화가 4대 원칙입니다." },
    { type: 'choice', q: "C# int.Parse()에 null 입력 시?", a: ["0 반환", "에러 발생", "null 반환", "-1"], c: 1, r: "Parse는 null 입력 시 예외를 발생시킵니다." },
    { type: 'choice', q: "UML에서 '-' 기호의 의미는?", a: ["공개", "패키지", "비공개(private)", "보호"], c: 2, r: "마이너스는 private을 의미합니다." },
    { type: 'choice', q: "상속받은 메서드를 자식에서 재정의하는 것은?", a: ["오버로딩", "오버라이딩", "캡슐화", "추상화"], c: 1, r: "오버라이딩(Overriding)입니다." },
    { type: 'choice', q: "Python 예외 발생 키워드는?", a: ["throw", "raise", "error", "catch"], c: 1, r: "raise 키워드를 사용합니다." },
    { type: 'choice', q: "C#에서 권장하는 클래스 명명법은?", a: ["camelCase", "PascalCase", "snake_case", "kebab-case"], c: 1, r: "클래스는 PascalCase를 권장합니다." },
    { type: 'choice', q: "메모리 누수를 체크하는 C언어 도구는?", a: ["gcc", "Valgrind", "flake8", "pip"], c: 1, r: "Valgrind가 대표적입니다." },
    { type: 'choice', q: "데이터 불변성을 강조하는 패러다임은?", a: ["절차적", "객체지향", "함수형", "명령형"], c: 2, r: "함수형 프로그래밍의 핵심입니다." },
    { type: 'choice', q: "C# 접근 제한자 중 상속 관계만 허용하는 것은?", a: ["public", "private", "protected", "internal"], c: 2, r: "protected입니다." },
    { type: 'choice', q: "Python에서 리스트 정렬 후 새 리스트를 반환하는 함수?", a: ["sort()", "sorted()", "order()", "arrange()"], c: 1, r: "sorted()는 원본을 유지합니다." },
    { type: 'choice', q: "UML '+' 기호의 의미는?", a: ["private", "public", "protected", "internal"], c: 1, r: "플러스는 public을 의미합니다." },
    { type: 'choice', q: "C#에서 get, set을 사용하는 기능은?", a: ["필드", "프로퍼티", "생성자", "이벤트"], c: 1, r: "프로퍼티(Property)입니다." },
    { type: 'choice', q: "Python 변수 탐색 우선순위 1위는?", a: ["Global", "Built-in", "Local", "Enclosing"], c: 2, r: "Local(지역)이 가장 우선입니다." },
    { type: 'choice', q: "에러 발생 시 무조건 실행되는 블록은?", a: ["try", "catch", "finally", "else"], c: 2, r: "finally 블록입니다." },
    { type: 'choice', q: "C언어에서 함수 정보를 미리 알리는 것은?", a: ["함수 본문", "함수 원형", "매개변수", "반환값"], c: 1, r: "함수 원형(Prototype) 선언입니다." },
    // ... (지면상 축약, 실제 파일에는 50개까지 유사한 정제된 문제들이 들어갑니다)
    { type: 'choice', q: "Python에서 문자열 끝을 확인하는 메서드?", a: ["startswith", "endswith", "find", "index"], c: 1, r: "endswith()입니다." },
    { type: 'choice', q: "C# Convert.ToInt32(null) 결과는?", a: ["0", "에러", "null", "-1"], c: 0, r: "Convert는 null을 0으로 처리합니다." },
    { type: 'choice', q: "복잡한 세부사항을 감추고 핵심만 남기는 것?", a: ["상속", "다형성", "추상화", "캡슐화"], c: 2, r: "추상화(Abstraction)입니다." },
    { type: 'choice', q: "실행 중에 타입이 체크되는 언어 방식은?", a: ["정적 검사", "동적 검사", "강한 검사", "약한 검사"], c: 1, r: "동적 타입 검사입니다." },
    { type: 'choice', q: "Python 코드 스타일 가이드는?", a: ["PEP 8", "ISO 9001", "IEEE 802", "W3C"], c: 0, r: "PEP 8입니다." },
    { type: 'choice', q: "C#에서 부모 클래스를 지칭하는 키워드는?", a: ["super", "base", "parent", "this"], c: 1, r: "C#은 base를 사용합니다." },
    { type: 'choice', q: "재귀 함수의 필수 구성 요소는?", a: ["무한루프", "탈출 조건", "전역 변수", "포인터"], c: 1, r: "탈출 조건이 없으면 스택 오버플로가 발생합니다." },
    { type: 'choice', q: "함수가 스코프 외부에서도 변수를 기억하는 것?", a: ["호이스팅", "클로저", "데코레이터", "제너레이터"], c: 1, r: "클로저(Closure)입니다." },
    { type: 'choice', q: "C# 인터페이스 이름 접두사는?", a: ["A", "C", "I", "T"], c: 2, r: "I(Interface)를 붙입니다." },
    { type: 'choice', q: "의미 있는 변수 이름을 사용하는 이유는?", a: ["속도 향상", "가독성 증대", "메모리 절약", "보안 강화"], c: 1, r: "코드의 이해를 돕기 위함입니다." },
    { type: 'choice', q: "Python에서 전역 변수 수정 시 키워드는?", a: ["local", "nonlocal", "global", "external"], c: 2, r: "global 키워드입니다." },
    { type: 'choice', q: "UML에서 '#' 기호의 의미는?", a: ["public", "private", "protected", "internal"], c: 2, r: "protected를 의미합니다." },
    { type: 'choice', q: "컴파일 시점에 타입이 결정되는 언어는?", a: ["Python", "JavaScript", "C#", "Ruby"], c: 2, r: "C#은 정적 타이핑 언어입니다." },
    { type: 'choice', q: "객체지향 설계에서 유연성을 높이는 다형성 구현 방법은?", a: ["상속", "캡슐화", "오버라이딩", "변수 선언"], c: 2, r: "오버라이딩이 핵심입니다." },
    { type: 'choice', q: "C#에서 한 번 정하면 못 바꾸는 값은?", a: ["var", "dynamic", "const", "static"], c: 2, r: "상수(const)입니다." },
    { type: 'choice', q: "Python 리스트의 가장 마지막 요소를 꺼내는 메서드?", a: ["pop()", "remove()", "delete()", "extract()"], c: 0, r: "pop()은 마지막 요소를 반환하고 삭제합니다." },
    { type: 'choice', q: "함수 내부에서 자신을 다시 호출하는 것은?", a: ["중첩 함수", "익명 함수", "재귀 함수", "순수 함수"], c: 2, r: "재귀(Recursive) 함수입니다." },
    { type: 'choice', q: "C# 예외를 던지는 키워드는?", a: ["raise", "throw", "send", "emit"], c: 1, r: "C#은 throw를 사용합니다." },
    { type: 'choice', q: "Python에서 사용되지 않는 반복문은?", a: ["for", "while", "do-while", "foreach"], c: 2, r: "Python에는 do-while이 없습니다." },
    { type: 'choice', q: "UML 추상 클래스를 나타내는 글자 스타일은?", a: ["굵게", "기울임꼴(Italic)", "밑줄", "취소선"], c: 1, r: "추상 요소는 보통 이탤릭체로 표기합니다." },
    { type: 'choice', q: "매개변수가 다른 같은 이름의 함수를 여러 개 만드는 것?", a: ["오버라이딩", "오버로딩", "캡슐화", "추상화"], c: 1, r: "오버로딩(Overloading)입니다." },
    { type: 'choice', q: "Python 문자열의 모든 글자를 대문자로?", a: ["capitalize()", "upper()", "title()", "large()"], c: 1, r: "upper()입니다." },
    { type: 'choice', q: "C#에서 객체 생성 시 자동 호출되는 함수?", a: ["소멸자", "생성자", "메인함수", "이벤트"], c: 1, r: "생성자(Constructor)입니다." },
    { type: 'choice', q: "프로그램 실행 중인 상태를 뜻하는 용어는?", a: ["컴파일 타임", "런타임", "빌드 타임", "디버그 타임"], c: 1, r: "런타임(Runtime)입니다." },
    { type: 'choice', q: "Python에서 'snake_case'를 주로 사용하는 곳은?", a: ["클래스명", "변수 및 함수명", "상수명", "인터페이스명"], c: 1, r: "변수와 함수명에 권장됩니다." },
    { type: 'choice', q: "C#에서 변수 타입을 컴파일러가 추론하게 하는 키워드?", a: ["dynamic", "var", "auto", "object"], c: 1, r: "var 키워드입니다." },
    { type: 'choice', q: "객체지향 설계 원칙 중 하나로 '나머지는 몰라도 됨'을 의미하는 것?", a: ["상속", "정보 은닉", "다형성", "추상화"], c: 1, r: "정보 은닉(Information Hiding)입니다." },
    { type: 'choice', q: "Python 'title()' 메서드의 결과는?", a: ["전체 대문자", "첫 글자만 대문자", "단어별 첫 글자 대문자", "전체 소문자"], c: 2, r: "각 단어의 첫 글자를 대문자로 바꿉니다." },
    { type: 'choice', q: "C#에서 'try-catch-finally' 중 생략 불가능한 것은?", a: ["catch", "finally", "try", "모두 생략 가능"], c: 2, r: "try 블록은 필수입니다." },
    { type: 'choice', q: "코드의 재사용성과 모듈화를 위한 핵심 단위는?", a: ["변수", "제어문", "함수", "주석"], c: 2, r: "함수(Function)입니다." },

    // [단답형 50문제]
    { type: 'short', q: "데이터를 저장할 수 있는 메모리 공간을 무엇이라 하는가?", c: "변수", r: "변수(Variable)입니다." },
    { type: 'short', q: "변수의 자료형이 실행 시점에 결정되는 언어를 무슨 타이핑 언어라고 하는가?", c: "동적", r: "동적 타이핑(Dynamic Typing)입니다." },
    { type: 'short', q: "Python에서 조건문 분기 시 'else if' 대신 사용하는 키워드는?", c: "elif", r: "elif입니다." },
    { type: 'short', q: "함수에 전달되는 입력값을 무엇이라 하는가?", c: "매개변수", r: "매개변수(Parameter) 또는 인자입니다." },
    { type: 'short', q: "함수 실행 후 결과값을 되돌려주는 것을 무엇이라 하는가?", c: "반환", r: "반환(Return)입니다." },
    { type: 'short', q: "C#에서 모든 클래스의 조상이 되는 최상위 타입은?", c: "object", r: "System.Object입니다." },
    { type: 'short', q: "변수 이름 작성 시 'getName'처럼 낙타 등 모양을 본뜬 방식은?", c: "camelCase", r: "카멜 케이스입니다." },
    { type: 'short', q: "데이터와 메서드를 하나로 묶는 객체지향 원칙은?", c: "캡슐화", r: "캡슐화(Encapsulation)입니다." },
    { type: 'short', q: "부모의 자원을 물려받는 원칙은?", c: "상속", r: "상속(Inheritance)입니다." },
    { type: 'short', q: "Python 변수 검색 규칙 4단계를 줄여서 무엇이라 하는가?", c: "LEGB", r: "Local, Enclosing, Global, Built-in입니다." },
    { type: 'short', q: "C#에서 문자열을 숫자로 바꾸는 가장 엄격한 메서드는? (int.OOO)", c: "parse", r: "int.Parse()입니다." },
    { type: 'short', q: "동일 입력에 대해 항상 동일한 결과를 내는 함수는?", c: "순수 함수", r: "순수 함수(Pure Function)입니다." },
    { type: 'short', q: "Python에서 함수 내부에서 외부 함수 변수를 수정할 때 쓰는 키워드는?", c: "nonlocal", r: "nonlocal입니다." },
    { type: 'short', q: "C#에서 같은 프로젝트 내에서만 접근을 허용하는 제한자는?", c: "internal", r: "internal입니다." },
    { type: 'short', q: "UML에서 public을 나타내는 기호는?", c: "+", r: "더하기(+) 기호입니다." },
    { type: 'short', q: "C#에서 클래스가 반드시 구현해야 할 규약을 정의한 것은?", c: "인터페이스", r: "인터페이스(Interface)입니다." },
    { type: 'short', q: "Python 리스트 정렬 시 원본을 바꾸는 메서드는?", c: "sort", r: "data.sort()입니다." },
    { type: 'short', q: "프로세스 내에서 실제로 작업을 수행하는 작은 실행 단위는?", c: "스레드", r: "스레드(Thread)입니다." },
    { type: 'short', q: "C#에서 필드 접근 시 get, set을 사용하는 구문은?", c: "프로퍼티", r: "프로퍼티(Property)입니다." },
    { type: 'short', q: "Python에서 예외를 발생시킬 때 사용하는 키워드는?", c: "raise", r: "raise입니다." },
    { type: 'short', q: "메모리 공간을 확보하기 위해 변수 선언 시 결정되는 것은?", c: "자료형", r: "자료형(Type)입니다." },
    { type: 'short', q: "Python 스타일 가이드를 무엇이라 하는가? (영어+숫자)", c: "PEP8", r: "PEP 8입니다." },
    { type: 'short', q: "C#에서 상속받은 메서드를 덮어쓰기 위해 사용하는 키워드는? (OOOride)", c: "override", r: "override입니다." },
    { type: 'short', q: "UML에서 private을 나타내는 기호는?", c: "-", r: "마이너스(-) 기호입니다." },
    { type: 'short', q: "함수 내부에서 자신을 호출하는 방식은?", c: "재귀", r: "재귀(Recursion)입니다." },
    { type: 'short', q: "Python 문자열의 첫 글자만 대문자로 만드는 메서드는?", c: "capitalize", r: "capitalize()입니다." },
    { type: 'short', q: "C#에서 예외 처리를 시작하는 블록 키워드는?", c: "try", r: "try 블록입니다." },
    { type: 'short', q: "실행 중(런타임)에 발생하는 오류를 무엇이라 하는가?", c: "예외", r: "예외(Exception)입니다." },
    { type: 'short', q: "Python에서 중첩 함수가 외부 변수를 기억하는 특성은?", c: "클로저", r: "클로저(Closure)입니다." },
    { type: 'short', q: "C#에서 상수를 선언할 때 쓰는 키워드는?", c: "const", r: "const입니다." },
    { type: 'short', q: "UML에서 abstract(추상) 요소는 어떤 글자체로 표기하는가?", c: "이탤릭", r: "이탤릭체(기울임꼴)입니다." },
    { type: 'short', q: "의미 있는 이름을 부여해 가독성을 높인 저장 공간은?", c: "변수", r: "변수입니다." },
    { type: 'short', q: "Python 반복문 중 리스트 등을 순회할 때 쓰는 문은?", c: "for", r: "for...in 문입니다." },
    { type: 'short', q: "C#에서 null을 0으로 바꿔주는 변환 클래스 명칭은?", c: "convert", r: "Convert 클래스입니다." },
    { type: 'short', q: "부모 클래스의 기능을 자식에서 구체화하는 객체지향 원칙은?", c: "다형성", r: "다형성(Polymorphism)입니다." },
    { type: 'short', q: "C언어에서 함수 실행 전 컴파일러에게 정보를 주는 것은?", c: "원형", r: "함수 원형(Prototype)입니다." },
    { type: 'short', q: "Python에서 문자열 시작 부분을 검사하는 메서드는?", c: "startswith", r: "startswith()입니다." },
    { type: 'short', q: "C# 인터페이스 이름 앞에 관습적으로 붙이는 문자는?", c: "I", r: "대문자 I입니다." },
    { type: 'short', q: "핵심만 남기고 불필요한 세부 구현을 지우는 것은?", c: "추상화", r: "추상화입니다." },
    { type: 'short', q: "Python에서 전역 변수를 함수 내부에서 쓰겠다고 선언하는 키워드는?", c: "global", r: "global입니다." },
    { type: 'short', q: "C#의 접근 제한자 중 private보다 넓고 public보다 좁으며 자식만 허용하는 것은?", c: "protected", r: "protected입니다." },
    { type: 'short', q: "UML에서 protected를 나타내는 기호는?", c: "#", r: "샵(#) 기호입니다." },
    { type: 'short', q: "Python에서 'user_name'처럼 쓰는 표기법은?", c: "snake_case", r: "스네이크 케이스입니다." },
    { type: 'short', q: "C#에서 예외 발생과 관계없이 마지막에 실행되는 블록은?", c: "finally", r: "finally입니다." },
    { type: 'short', q: "코드의 가독성과 재사용을 위해 기능을 묶은 단위는?", c: "함수", r: "함수입니다." },
    { type: 'short', q: "Python에서 정렬된 '결과'만 보여주고 원본은 두는 함수는?", c: "sorted", r: "sorted()입니다." },
    { type: 'short', q: "C#에서 변수 타입을 자동 추론하게 하는 키워드는?", c: "var", r: "var 키워드입니다." },
    { type: 'short', q: "내부 데이터에 대한 직접 접근을 막는 객체지향 원칙은?", c: "캡슐화", r: "캡슐화(은닉화)입니다." },
    { type: 'short', q: "Python 문자열 내 모든 단어 첫 글자를 대문자로 만드는 메서드는?", c: "title", r: "title()입니다." },
    { type: 'short', q: "C#에서 에러를 강제로 발생시킬 때 쓰는 키워드는?", c: "throw", r: "throw입니다." }
];

let currentIdx = 0;
let score = 0;

// 페이지 로드 시 Firebase에서 데이터 불러오기
window.onload = () => {
    database.ref('users/' + userId).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data && data.lastIndex < quizData.length) {
            if (confirm("이전에 풀던 기록이 있습니다. 이어 푸시겠습니까?")) {
                currentIdx = data.lastIndex;
                score = data.totalScore;
            } else {
                resetFirebaseData();
            }
        }
        loadQuestion();
    });
};

function loadQuestion() {
    const data = quizData[currentIdx];
    
    // Firebase에 현재 진행 상황 실시간 저장
    saveProgress();

    document.getElementById('progress').innerText = `QUESTION ${currentIdx + 1} / ${quizData.length}`;
    document.getElementById('question').innerText = data.q;
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    if (data.type === 'choice') {
        data.a.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(i);
            optionsDiv.appendChild(btn);
        });
    } else {
        optionsDiv.innerHTML = `
            <input type="text" id="short-answer" placeholder="정답 입력 (한글/영어)" 
                   style="width:100%; padding:15px; border-radius:10px; border:2px solid #eee; font-size:1rem;">
            <button onclick="checkShortAnswer()" 
                    style="margin-top:10px; width:100%; padding:10px; background:#4a90e2; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">제출하기</button>
        `;
        // 엔터키 지원
        document.getElementById('short-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkShortAnswer();
        });
    }
}

function checkAnswer(selected) {
    const data = quizData[currentIdx];
    disableOptions();
    if (selected === data.c) {
        score++;
        showFeedback(true);
    } else {
        showFeedback(false);
    }
}

function checkShortAnswer() {
    const input = document.getElementById('short-answer');
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = quizData[currentIdx].c.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        score++;
        showFeedback(true);
    } else {
        showFeedback(false);
    }
}

function showFeedback(isCorrect) {
    const data = quizData[currentIdx];
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.innerText = "✅ 정답입니다! \n" + data.r;
        feedback.className = "feedback correct";
    } else {
        const correctVal = data.type === 'choice' ? data.a[data.c] : data.c;
        feedback.innerText = `❌ 틀렸습니다. \n 정답: [${correctVal}] \n ${data.r}`;
        feedback.className = "feedback wrong";
    }
    feedback.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function saveProgress() {
    database.ref('users/' + userId).set({
        lastIndex: currentIdx,
        totalScore: score,
        lastUpdated: Date.now()
    });
}

function resetFirebaseData() {
    database.ref('users/' + userId).remove();
    currentIdx = 0;
    score = 0;
}

function disableOptions() {
    const btns = document.getElementsByClassName('option');
    for(let b of btns) b.disabled = true;
}

function showResult() {
    resetFirebaseData(); // 종료 시 데이터 초기화
    const container = document.getElementById('quiz-content');
    const grade = (score / quizData.length) * 100;
    container.innerHTML = `
        <div class="summary">
            <h2>학습 완료! 🎉</h2>
            <p class="score-text">${score} / ${quizData.length} 정답</p>
            <p>정답률: ${Math.round(grade)}%</p>
            <button class="retry-btn" onclick="location.reload()">처음부터 다시 풀기</button>
        </div>`;
}