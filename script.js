// 1. Firebase 구성 설정
const firebaseConfig = {
    apiKey: "AIzaSyBsHbosmYs7U8y6uDuYeRaibMVoAx8-fQ4",
    authDomain: "quiz-d2d9a.firebaseapp.com",
    databaseURL: "https://quiz-d2d9a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quiz-d2d9a",
    storageBucket: "quiz-d2d9a.firebasestorage.app",
    messagingSenderId: "114749518417",
    appId: "1:114749518417:web:44300ef313bb69aae2fe70"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 전역 변수
let nickname = "";
let selectedType = "choice";
let selectedCount = 20;
let currentQuizSet = [];
let currentIdx = 0;
let score = 0;

// 2. 퀴즈 데이터 (독스 파일 기반 총 100문제)
const rawChoiceData = [
    { q: "데이터를 저장할 수 있는 메모리 공간을 무엇이라 하는가?", a: ["상수", "변수", "함수", "클래스"], c: 1, r: "변수는 데이터를 저장하는 공간이며 초기값 할당 및 변경이 가능합니다." },
    { q: "변수의 자료형이 런타임에 결정되는 언어 방식은?", a: ["정적 타이핑", "동적 타이핑", "강타입", "약타입"], c: 1, r: "Python과 JavaScript는 동적 타이핑 언어입니다." },
    { q: "C#에서 같은 어셈블리 내 모든 코드에서 접근 가능한 제한자는?", a: ["public", "private", "internal", "protected"], c: 2, r: "internal은 동일 프로젝트(어셈블리) 내 접근을 허용합니다." },
    { q: "객체지향 원칙 중 내부 구현을 숨기고 인터페이스만 공개하는 것은?", a: ["상속", "다형성", "캡슐화", "추상화"], c: 2, r: "캡슐화는 정보 은닉을 목적으로 합니다." },
    { q: "Python의 변수 검색 규칙(LEGB) 중 'E'가 의미하는 것은?", a: ["External", "Enclosing", "Entry", "Extended"], c: 1, r: "E는 중첩 함수 범위를 의미하는 Enclosing입니다." },
    { q: "부모 클래스의 메서드를 자식 클래스에서 재정의하는 것은?", a: ["오버로딩", "오버라이딩", "추상화", "캡슐화"], c: 1, r: "메서드 재정의는 오버라이딩입니다." },
    { q: "Python에서 의도적으로 에러를 발생시키는 키워드는?", a: ["throw", "raise", "error", "except"], c: 1, r: "Python은 raise 키워드를 사용합니다." },
    { q: "C#에서 클래스 명명에 권장되는 표기법은?", a: ["camelCase", "snake_case", "PascalCase", "kebab-case"], c: 2, r: "C# 클래스명은 PascalCase를 사용합니다." },
    { q: "UML 표기법에서 '-' 기호가 의미하는 접근 제한은?", a: ["public", "private", "protected", "internal"], c: 1, r: "마이너스(-)는 private을 의미합니다." },
    { q: "프로세스 내에서 실행되는 실제 흐름의 단위는?", a: ["프로세서", "스레드", "어셈블리", "인스턴스"], c: 1, r: "실행 흐름의 단위는 스레드입니다." },
    { q: "순수 함수의 특징으로 옳은 것은?", a: ["부수 효과 발생", "상태 변경", "동일 입력 시 동일 결과", "랜덤 값 반환"], c: 2, r: "순수 함수는 외부 상태를 변경하지 않습니다." },
    { q: "Python에서 함수를 선언할 때 사용하는 키워드는?", a: ["function", "def", "func", "static"], c: 1, r: "Python은 def 키워드를 사용합니다." },
    { q: "C# int.Parse()에 null 입력 시 결과는?", a: ["0 반환", "에러 발생", "null 반환", "-1 반환"], c: 1, r: "int.Parse는 null 입력 시 예외가 발생합니다." },
    { q: "함수가 정의된 스코프 외부 변수를 기억하는 특성은?", a: ["호이스팅", "섀도잉", "클로저", "캡슐화"], c: 2, r: "함수와 그 환경을 기억하는 것은 클로저입니다." },
    { q: "UML에서 이탤릭체(기울임)로 표시되는 메서드는?", a: ["정적 메서드", "추상 메서드", "비공개 메서드", "공개 메서드"], c: 1, r: "추상 메서드는 이탤릭체로 표기합니다." },
    { q: "Python 문자열의 시작 부분을 검사하는 메서드는?", a: ["find", "startswith", "endswith", "index"], c: 1, r: "startswith() 메서드입니다." },
    { q: "C#에서 상속받은 자식 클래스만 접근 가능한 제한자는?", a: ["private", "protected", "internal", "public"], c: 1, r: "protected는 자식에게만 허용합니다." },
    { q: "매개변수의 개수나 타입에 따라 동작이 달라지는 다형성은?", a: ["오버라이딩", "오버로딩", "추상화", "캡슐화"], c: 1, r: "정적 다형성인 오버로딩입니다." },
    { q: "Python 클래스에서 객체 생성 시 자동 호출되는 생성자는?", a: ["__init__", "__new__", "constructor", "Person"], c: 0, r: "__init__이 생성자입니다." },
    { q: "데이터는 생성 후 변경되지 않는다는 원칙은?", a: ["순수성", "불변성", "다형성", "캡슐화"], c: 1, r: "불변성(Immutability)입니다." },
    { q: "Python에서 전역 변수를 수정하기 위해 명시하는 키워드는?", a: ["local", "nonlocal", "global", "static"], c: 2, r: "global 키워드가 필요합니다." },
    { q: "C#에서 필드 접근 제어를 위해 get/set을 쓰는 기능은?", a: ["메서드", "프로퍼티", "생성자", "이벤트"], c: 1, r: "프로퍼티(Property)입니다." },
    { q: "Python 리스트를 오름차순으로 직접 정렬하는 메서드는?", a: ["sorted()", "sort()", "order()", "arrange()"], c: 1, r: "sort()는 리스트를 직접 변경합니다." },
    { q: "UML에서 '+' 기호가 의미하는 접근 제한은?", a: ["private", "public", "protected", "internal"], c: 1, r: "플러스(+)는 public을 뜻합니다." },
    { q: "내부 스코프 변수가 외부의 같은 이름 변수를 가리는 현상은?", a: ["클로저", "호이스팅", "섀도잉", "모듈화"], c: 2, r: "변수 섀도잉 현상입니다." },
    { q: "C#이나 Java에서 에러를 던질 때 사용하는 키워드는?", a: ["raise", "throw", "emit", "send"], c: 1, r: "C#은 throw를 사용합니다." },
    { q: "첫 글자 소문자, 중간 단어 첫 글자 대문자인 방식은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 1, r: "예: getName()은 camelCase입니다." },
    { q: "Python 스코프 검색 규칙에서 가장 나중에 찾는 곳은?", a: ["Local", "Global", "Enclosing", "Built-in"], c: 3, r: "Built-in이 마지막 단계입니다." },
    { q: "C# 인터페이스 이름 앞에 관습적으로 붙이는 문자는?", a: ["C", "A", "I", "T"], c: 2, r: "I(Interface)를 붙입니다." },
    { q: "핵심 개념만 모델링하고 세부사항을 감추는 원칙은?", a: ["상속", "추상화", "다형성", "캡슐화"], c: 1, r: "추상화에 대한 설명입니다." },
    { q: "동일 입력에 항상 같은 결과를 내는 함수의 성질은?", a: ["멱등성", "순수성", "원자성", "독립성"], c: 1, r: "순수 함수의 특징입니다." },
    { q: "Python에서 외부 함수의 변수를 수정할 때 쓰는 키워드는?", a: ["global", "nonlocal", "local", "outer"], c: 1, r: "중첩 함수 내에서는 nonlocal을 사용합니다." },
    { q: "변수 선언 시 자료형을 명시해야 하는 언어는?", a: ["Python", "JavaScript", "C#", "Ruby"], c: 2, r: "C#은 정적 타이핑 언어입니다." },
    { q: "프로그램 실행 중 오류 발생 시 실행되는 블록은?", a: ["try", "catch", "finally", "else"], c: 1, r: "예외 처리는 catch(Python은 except)에서 합니다." },
    { q: "C언어에서 main() 이전에 함수 정보를 알리는 것은?", a: ["함수 본문", "함수 원형", "매개변수", "반환값"], c: 1, r: "함수 원형(Prototype)입니다." },
    { q: "Python 문자열의 첫 문자만 대문자로 만드는 메서드는?", a: ["upper()", "capitalize()", "title()", "lower()"], c: 1, r: "capitalize()입니다." },
    { q: "C#에서 상수와 정적 필드에 권장되는 표기법은?", a: ["camelCase", "snake_case", "PascalCase", "kebab-case"], c: 2, r: "C# 상수는 PascalCase를 권장합니다." },
    { q: "컴파일 시점에 타입 검사를 수행하는 방식은?", a: ["정적 검사", "동적 검사", "강타입", "약타입"], c: 0, r: "정적 타입 검사입니다." },
    { q: "Python에서 원본 리스트를 유지하며 정렬된 새 리스트를 반환하는 것은?", a: ["sort()", "sorted()", "reverse()", "filter()"], c: 1, r: "sorted()는 원본을 건드리지 않습니다." },
    { q: "코드 재사용성과 계층 구조 형성을 돕는 원칙은?", a: ["캡슐화", "상속", "추상화", "다형성"], c: 1, r: "상속에 대한 설명입니다." },
    { q: "C#에서 복잡한 로직이 필요할 때 사용하는 필드 방식은?", a: ["정적 필드", "백킹 필드", "공개 필드", "매개변수"], c: 1, r: "백킹 필드(Backing Field)를 사용합니다." },
    { q: "단어 사이에 언더바(_)를 사용하는 표기법은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 2, r: "snake_case입니다." },
    { q: "Python에서 상수를 표기할 때 권장되는 방식은?", a: ["PascalCase", "camelCase", "UPPER_CASE", "snake_case"], c: 2, r: "대문자와 언더바를 사용합니다." },
    { q: "자료형이 변수에 할당되는 무엇을 결정하는가?", a: ["변수 이름", "메모리 크기", "실행 순서", "함수 이름"], c: 1, r: "자료형은 메모리 크기를 결정합니다." },
    { q: "변수 선언이 최상단으로 끌어올려지는 듯한 현상은?", a: ["클로저", "호이스팅", "섀도잉", "모듈화"], c: 1, r: "호이스팅(Hoisting)입니다." },
    { q: "C#에서 null 입력 시 0을 반환하는 변환 방식은?", a: ["int.Parse", "Convert.ToInt32", "ToString", "Cast"], c: 1, r: "Convert 방식의 특징입니다." },
    { q: "함수 내부에서 자신을 다시 호출하는 함수는?", a: ["고차 함수", "순수 함수", "재귀 함수", "내장 함수"], c: 2, r: "재귀 함수(Recursion)입니다." },
    { q: "UML에서 추상 클래스 명칭의 표기 방법은?", a: ["굵게", "기울임", "밑줄", "대문자"], c: 1, r: "이탤릭체(기울임)로 표기합니다." },
    { q: "Python에서 리스트를 내림차순으로 정렬하는 방법은?", a: ["sort()", "sort(reverse=True)", "reverse()", "down_sort()"], c: 1, r: "reverse=True 옵션을 사용합니다." },
    { q: "함수형 프로그래밍에서 함수를 인자로 전달하는 특징은?", a: ["일급 객체", "정적 필드", "캡슐화", "추상화"], c: 0, r: "함수가 일급 객체이기 때문입니다." }
];

const rawShortData = [
    { q: "데이터를 저장할 수 있는 메모리 공간을 무엇이라 하는가?", c: "변수", r: "변수(Variable)입니다." },
    { q: "Python처럼 실행 시점에 자료형이 결정되는 방식은?", c: "동적타이핑", r: "동적 타이핑(Dynamic Typing)입니다." },
    { q: "C#에서 같은 어셈블리 내 접근을 허용하는 제한자는?", c: "internal", r: "internal 제한자입니다." },
    { q: "Python 변수 검색 규칙 4단계를 줄여서 무엇이라 하는가?", c: "LEGB", r: "Local, Enclosing, Global, Built-in입니다." },
    { q: "함수 외부 상태를 바꾸지 않고 동일 결과를 보장하는 함수는?", c: "순수함수", r: "순수 함수(Pure Function)입니다." },
    { q: "데이터와 메서드를 하나로 묶고 접근을 제한하는 원칙은?", c: "캡슐화", r: "캡슐화(Encapsulation)입니다." },
    { q: "C#에서 문자열을 숫자로 변환 시 null이면 에러를 내는 메서드는?", c: "parse", r: "int.Parse()입니다." },
    { q: "부모 메서드를 자식에서 재정의하는 것을 무엇이라 하는가?", c: "오버라이딩", r: "오버라이딩(Overriding)입니다." },
    { q: "Python에서 예외를 강제로 발생시킬 때 사용하는 키워드는?", c: "raise", r: "raise 키워드입니다." },
    { q: "C#에서 클래스 명명 시 권장되는 표기법 명칭은?", c: "파스칼케이스", r: "PascalCase입니다." },
    { q: "UML 표기법에서 비공개(private)를 나타내는 기호는?", c: "-", r: "마이너스(-) 기호입니다." },
    { q: "C# Convert 방식에 null을 넣었을 때 반환되는 숫자는?", c: "0", r: "0을 반환합니다." },
    { q: "함수 내부에서 자기 자신을 호출하는 기법은?", c: "재귀", r: "재귀(Recursion)입니다." },
    { q: "문자열이 특정 단어로 시작하는지 확인하는 메서드는?", c: "startswith", r: "startswith()입니다." },
    { q: "세부사항을 숨기고 핵심만 모델링하는 설계 원칙은?", c: "추상화", r: "추상화(Abstraction)입니다." },
    { q: "Python 리스트 원본을 직접 오름차순 정렬하는 메서드는?", c: "sort", r: "data.sort()입니다." },
    { q: "C#에서 상속받은 자식 클래스만 접근을 허용하는 제한자는?", c: "protected", r: "protected입니다." },
    { q: "타입 변환이 암묵적으로 이루어지는 언어 특징은?", c: "약타입", r: "약타입(Weak Type)입니다." },
    { q: "Python 중첩 함수에서 외부 함수의 변수를 수정하는 키워드는?", c: "nonlocal", r: "nonlocal입니다." },
    { q: "컴파일 시점에 타입 검사를 하는 것을 무엇이라 하는가?", c: "정적타입검사", r: "정적 타입 검사입니다." },
    { q: "단어 첫 글자는 소문자, 중간 글자는 대문자인 표기법은?", c: "카멜케이스", r: "camelCase입니다." },
    { q: "하나의 인터페이스로 여러 동작을 수행하는 원칙은?", c: "다형성", r: "다형성(Polymorphism)입니다." },
    { q: "Python에서 정렬된 새 리스트를 반환하는 내장 함수는?", c: "sorted", r: "sorted()입니다." },
    { q: "C# 인터페이스 이름 앞에 붙이는 대문자 알파벳은?", c: "I", r: "I(아이)입니다." },
    { q: "UML에서 공개(public)를 나타내는 기호는?", c: "+", r: "플러스(+) 기호입니다." },
    { q: "C#이나 Java에서 오류를 강제로 발생시키는 키워드는?", c: "throw", r: "throw입니다." },
    { q: "단어 사이에 언더바(_)를 사용하는 명명법은?", c: "스네이크케이스", r: "snake_case입니다." },
    { q: "오류가 발생할 것 같은 코드를 감싸는 블록 이름은?", c: "try", r: "try 블록입니다." },
    { q: "Python에서 모든 문자를 대문자로 쓰는 변수의 일반적 의미는?", c: "상수", r: "상수(Constant)입니다." },
    { q: "C#에서 필드의 읽기/쓰기를 제어하는 구문은?", c: "프로퍼티", r: "프로퍼티입니다." },
    { q: "UML에서 추상 메서드를 표기할 때 쓰는 글씨 스타일은?", c: "이탤릭", r: "이탤릭체(기울임)입니다." },
    { q: "기존 속성과 기능을 물려받아 재사용하는 원칙은?", c: "상속", r: "상속(Inheritance)입니다." },
    { q: "데이터 변경을 금지하는 함수형 프로그래밍 원칙은?", c: "불변성", r: "불변성(Immutability)입니다." },
    { q: "Python 클래스 생성자 메서드의 명칭은?", c: "__init__", r: "__init__입니다." },
    { q: "C언어에서 관습적으로 쓰이는 명명법은?", c: "스네이크케이스", r: "snake_case입니다." },
    { q: "함수 안에서 전역 변수를 쓰겠다고 선언하는 키워드는?", c: "global", r: "global입니다." },
    { q: "런타임에 타입 검사를 하는 것을 무엇이라 하는가?", c: "동적타입검사", r: "동적 타입 검사입니다." },
    { q: "함수를 인자로 받거나 반환하는 함수를 무엇이라 하는가?", c: "고차함수", r: "고차 함수입니다." },
    { q: "문자열의 첫 글자만 대문자로 만드는 Python 메서드는?", c: "capitalize", r: "capitalize()입니다." },
    { q: "동일 이름 메서드가 매개변수에 따라 다르게 작동하는 것은?", c: "오버로딩", r: "오버로딩입니다." },
    { q: "C# 클래스 외부에서 자유롭게 접근 가능한 제한자는?", c: "public", r: "public입니다." },
    { q: "스코프 내에서 같은 이름으로 외부 변수를 가리는 현상은?", c: "섀도잉", r: "변수 섀도잉입니다." },
    { q: "자료형을 명시하지 않아도 되는 Python의 특징은?", c: "동적타이핑", r: "동적 타이핑입니다." },
    { q: "프로세스 실행 흐름의 최소 단위는?", c: "스레드", r: "스레드(Thread)입니다." },
    { q: "UML에서 '#' 기호가 의미하는 접근 제한은?", c: "protected", r: "protected를 의미합니다." },
    { q: "C#에서 상수 선언 시 사용하는 키워드는?", c: "const", r: "const 키워드입니다." },
    { q: "Python에서 조건문 분기 시 if, else 외에 사용하는 키워드는?", c: "elif", r: "elif입니다." },
    { q: "변수 선언 시 할당되는 것 중 하나로 크기를 결정하는 것은?", c: "자료형", r: "자료형입니다." },
    { q: "결과값을 반환하지 않는 함수를 C#에서 정의할 때 쓰는 키워드는?", c: "void", r: "void입니다." },
    { q: "객체의 설계도를 의미하는 클래스의 실체를 무엇이라 하는가?", c: "인스턴스", r: "인스턴스(Instance)입니다." }
];

// 화면 제어 함수
function goToSetup() {
    const input = document.getElementById('user-name-input').value.trim();
    if (!input) { alert("이름을 입력해주세요!"); return; }
    nickname = input;
    document.getElementById('step-name').style.display = 'none';
    document.getElementById('step-setup').style.display = 'flex';
}

function setType(type) {
    selectedType = type;
    document.getElementById('type-choice').classList.toggle('selected', type === 'choice');
    document.getElementById('type-short').classList.toggle('selected', type === 'short');
}

function setCount(count) {
    selectedCount = count;
    [20, 30, 50].forEach(c => {
        document.getElementById(`count-${c}`).classList.toggle('selected', c === count);
    });
}

function startQuiz() {
    const baseData = selectedType === 'choice' ? rawChoiceData : rawShortData;
    currentQuizSet = [...baseData].sort(() => Math.random() - 0.5).slice(0, selectedCount);
    currentIdx = 0;
    score = 0;
    document.getElementById('step-setup').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const data = currentQuizSet[currentIdx];
    document.getElementById('progress').innerText = `문제 ${currentIdx + 1} / ${selectedCount}`;
    document.getElementById('question').innerText = data.q;
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';

    if (selectedType === 'choice') {
        data.a.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.innerText = opt;
            btn.onclick = () => checkChoiceAnswer(i);
            optionsDiv.appendChild(btn);
        });
    } else {
        optionsDiv.innerHTML = `
            <input type="text" id="short-answer" placeholder="정답 입력 후 엔터">
            <button class="start-btn" onclick="checkShortAnswer()" style="width:100%; margin-top:10px;">제출</button>
        `;
        document.getElementById('short-answer').addEventListener('keypress', (e) => {
            if(e.key === 'Enter') checkShortAnswer();
        });
    }
}

function checkChoiceAnswer(idx) {
    const btns = document.getElementsByClassName('option');
    for(let b of btns) b.disabled = true;
    if (idx === currentQuizSet[currentIdx].c) { score++; showFeedback(true); } 
    else { showFeedback(false); }
}

function checkShortAnswer() {
    const input = document.getElementById('short-answer');
    if(input.disabled) return;
    const userVal = input.value.trim().replace(/\s+/g, '').toLowerCase();
    const correctVal = currentQuizSet[currentIdx].c.replace(/\s+/g, '').toLowerCase();
    input.disabled = true;
    if (userVal === correctVal) { score++; showFeedback(true); }
    else { showFeedback(false); }
}

function showFeedback(isCorrect) {
    const data = currentQuizSet[currentIdx];
    const fb = document.getElementById('feedback');
    fb.style.display = 'block';
    if (isCorrect) {
        fb.className = "feedback correct";
        fb.innerText = "✅ 정답입니다!\n" + data.r;
    } else {
        fb.className = "feedback wrong";
        const ans = selectedType === 'choice' ? data.a[data.c] : data.c;
        fb.innerText = `❌ 틀렸습니다. (정답: ${ans})\n` + data.r;
    }
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < selectedCount) loadQuestion();
    else showResult();
}

function showResult() {
    const container = document.getElementById('quiz-container');
    const percent = Math.round((score / selectedCount) * 100);
    database.ref('results/' + nickname).push({ score, total: selectedCount, date: new Date().toLocaleString() });
    container.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <h2>🎉 테스트 완료!</h2>
            <p>${nickname}님의 최종 점수</p>
            <h1 style="color:#4a90e2;">${score} / ${selectedCount}</h1>
            <p>정답률: ${percent}%</p>
            <button class="start-btn" onclick="location.reload()">처음으로 돌아가기</button>
        </div>
    `;
}