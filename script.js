// Firebase 구성
const firebaseConfig = {
    apiKey: "AIzaSyBsHbosmYs7U8y6uDuYeRaibMVoAx8-fQ4",
    authDomain: "quiz-d2d9a.firebaseapp.com",
    databaseURL: "https://quiz-d2d9a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quiz-d2d9a",
    storageBucket: "quiz-d2d9a.firebasestorage.app",
    messagingSenderId: "114749518417",
    appId: "1:114749518417:web:44300ef313bb69aae2fe70"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 상태 변수
let nickname = "";
let selectedType = "choice";
let selectedCount = 20;
let currentQuizSet = [];
let currentIdx = 0;
let score = 0;

// 문제 데이터 (기존 데이터 기반)
const rawChoiceData = [
    { q: "변수의 특징으로 옳지 않은 것은?", a: ["데이터 저장 메모리 공간", "초기값 할당 가능", "한 번 설정하면 변경 불가", "재사용 가능"], c: 2, r: "변수는 초기값 할당 후 변경이 가능합니다. [cite: 3, 4]" },
    { q: "Python과 같이 런타임에 자료형이 결정되는 언어 방식은?", a: ["정적 타이핑", "강타입", "동적 타이핑", "약타입"], c: 2, r: "런타임에 결정되는 것은 동적 타이핑입니다. [cite: 9]" },
    { q: "C#에서 같은 어셈블리 내의 모든 코드에서 접근 가능하게 하는 제한자는?", a: ["public", "private", "internal", "protected"], c: 2, r: "internal은 동일 어셈블리 내에서 접근 가능합니다. [cite: 169]" },
    { q: "Python LEGB 규칙 중 'E'가 의미하는 범위는?", a: ["External", "Enclosing", "Entry", "Else"], c: 1, r: "Enclosing(중첩 함수 범위)입니다. [cite: 78]" },
    { q: "순수 함수의 특징으로 옳은 것은?", a: ["상태 변경 중심", "동일 입력 시 동일 결과 반환", "매개변수 없음", "랜덤 결과 생성"], c: 1, r: "순수 함수는 외부 상태를 변경하지 않고 동일 입력을 보장합니다. [cite: 250]" },
    { q: "C# int.Parse()에 null 입력 시 발생하는 결과는?", a: ["0 반환", "에러 발생", "null 반환", "-1"], c: 1, r: "int.Parse는 null 입력 시 에러가 발생합니다. [cite: 327]" },
    { q: "UML 표기법에서 '-' 기호가 의미하는 접근 제한은?", a: ["공개(public)", "패키지", "비공개(private)", "보호(protected)"], c: 2, r: "'-'는 private을 의미합니다. [cite: 278]" },
    { q: "부모 클래스의 메서드를 자식에서 재정의하는 동적 다형성은?", a: ["오버로딩", "오버라이딩", "캡슐화", "추상화"], c: 1, r: "오버라이딩(Overriding)입니다. [cite: 300]" },
    { q: "Python에서 의도적으로 예외를 발생시키는 키워드는?", a: ["throw", "raise", "error", "except"], c: 1, r: "Python은 raise 키워드를 사용합니다. [cite: 106]" },
    { q: "C#에서 권장하는 클래스 및 메서드 명명법은?", a: ["camelCase", "PascalCase", "snake_case", "kebab-case"], c: 1, r: "C# 클래스와 메서드는 PascalCase를 사용합니다. [cite: 162]" },
    { q: "데이터의 불변성을 강조하며 함수를 변수처럼 다루는 패러다임은?", a: ["절차적", "객체지향", "함수형", "명령형"], c: 2, r: "함수형 프로그래밍의 특징입니다. [cite: 246, 251]" },
    { q: "C# 접근 제한자 중 상속 관계인 클래스만 접근을 허용하는 것은?", a: ["public", "private", "protected", "internal"], c: 2, r: "protected입니다. [cite: 171]" },
    { q: "Python에서 원본 리스트를 유지하며 정렬된 새 결과를 반환하는 함수는?", a: ["sort()", "sorted()", "order()", "arrange()"], c: 1, r: "sorted()는 원본을 바꾸지 않습니다. [cite: 321]" },
    { q: "UML 표기법에서 '+' 기호가 의미하는 것은?", a: ["private", "public", "protected", "internal"], c: 1, r: "'+'는 public을 의미합니다. [cite: 278]" },
    { q: "C#에서 get과 set을 사용하여 필드 접근을 제어하는 기능은?", a: ["필드", "프로퍼티", "생성자", "이벤트"], c: 1, r: "프로퍼티(Property)입니다. [cite: 181]" },
    { q: "Python 변수 탐색 우선순위(LEGB) 중 가장 먼저 검색하는 곳은?", a: ["Global", "Built-in", "Local", "Enclosing"], c: 2, r: "Local 범위를 가장 먼저 찾습니다. [cite: 78]" },
    { q: "예상 가능한 상황을 처리할 때 적합한 도구는?", a: ["try-except", "조건문(if)", "raise", "throw"], c: 1, r: "예상 가능하면 조건문을 사용합니다. [cite: 83]" },
    { q: "C언어에서 main() 함수 이전에 함수 정보를 알리는 선언은?", a: ["함수 본문", "함수 원형", "매개변수", "반환값"], c: 1, r: "함수 원형(Prototype) 선언입니다. [cite: 30]" },
    { q: "Python 문자열의 시작 부분을 검사하는 메서드는?", a: ["startswith", "endswith", "find", "index"], c: 0, r: "startswith()입니다. [cite: 315]" },
    { q: "C# Convert.ToInt32(null)의 결과값은?", a: ["0", "에러 발생", "null", "-1"], c: 0, r: "Convert 방식은 null 입력 시 0을 반환합니다. [cite: 333]" },
    { q: "핵심만 모델링하고 불필요한 세부사항을 감추는 원칙은?", a: ["상속", "다형성", "추상화", "캡슐화"], c: 2, r: "추상화(Abstraction)입니다. [cite: 304]" },
    { q: "컴파일 시점에 타입 검사를 수행하는 언어의 특징은?", a: ["유연성 높음", "버그 조기 발견", "런타임 오류 증가", "프로토타이핑 유리"], c: 1, r: "정적 타입 검사는 버그를 조기 발견합니다. [cite: 140]" },
    { q: "Python에서 변수와 함수명에 권장되는 표기법은?", a: ["PascalCase", "snake_case", "camelCase", "UPPER_CASE"], c: 1, r: "Python 변수/함수는 snake_case를 사용합니다. [cite: 155]" },
    { q: "Python에서 부모 클래스의 메서드를 호출할 때 사용하는 키워드는?", a: ["base", "parent", "super", "this"], c: 2, r: "super()를 사용합니다. [cite: 226]" },
    { q: "정의된 스코프 외부에서도 그 안의 변수를 기억하는 특성은?", a: ["호이스팅", "섀도잉", "클로저", "데코레이터"], c: 2, r: "클로저(Closure)입니다. [cite: 77]" },
    { q: "C#에서 인터페이스 이름 앞에 관습적으로 붙이는 문자는?", a: ["A", "C", "I", "T"], c: 2, r: "대문자 I를 붙입니다. [cite: 163]" },
    { q: "Python에서 함수 내부에서 전역 변수를 수정하기 위한 키워드는?", a: ["local", "nonlocal", "global", "external"], c: 2, r: "global 키워드가 필요합니다. [cite: 66]" },
    { q: "변수와 값의 타입이 엄격하게 유지되는 언어의 특징은?", a: ["약타입", "강타입", "동적 타입", "암묵적 변환"], c: 1, r: "강타입 언어의 특징입니다. [cite: 131]" },
    { q: "매개변수의 타입이나 개수에 따라 다르게 작동하는 다형성은?", a: ["오버라이딩", "오버로딩", "추상화", "캡슐화"], c: 1, r: "오버로딩(Overloading)입니다. [cite: 298]" },
    { q: "C#에서 상수와 정적 필드에 권장되는 표기법은?", a: ["camelCase", "PascalCase", "snake_case", "kebab-case"], c: 1, r: "PascalCase를 사용합니다. [cite: 163]" },
    { q: "첫 글자를 대문자로 쓰는 명명법은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 0, r: "PascalCase입니다. [cite: 150]" },
    { q: "Python에서 지원하지 않는 반복문 유형은?", a: ["for", "while", "do-while", "foreach"], c: 2, r: "Python에는 do-while문이 없습니다. [cite: 17]" },
    { q: "UML에서 추상 메서드를 나타내는 스타일은?", a: ["굵게", "이탤릭체", "밑줄", "파란색"], c: 1, r: "이탤릭체로 표기합니다. [cite: 301]" },
    { q: "Python에서 상수를 표기할 때 권장되는 방식은?", a: ["PascalCase", "camelCase", "UPPER_CASE", "snake_case"], c: 2, r: "UPPER_CASE를 사용합니다. [cite: 155]" },
    { q: "C#이나 Java에서 에러를 던질 때 사용하는 키워드는?", a: ["raise", "throw", "emit", "send"], c: 1, r: "throw를 사용합니다. [cite: 116]" },
    { q: "C언어에서 변수명, 함수명에 주로 사용하는 표기법은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 2, r: "snake_case를 씁니다. [cite: 158]" },
    { q: "C#의 어셈블리 단위에 해당하는 파일 확장자는?", a: [".c", ".py", ".exe / .dll", ".js"], c: 2, r: "어셈블리는 .exe나 .dll 파일 단위입니다. [cite: 170]" },
    { q: "클래스 내부 데이터 접근을 막고 메서드로만 허용하는 원칙은?", a: ["상속", "캡슐화", "다형성", "코드 재사용"], c: 1, r: "캡슐화입니다. [cite: 266]" },
    { q: "Python 문자열의 첫 문자만 대문자로 만드는 메서드는?", a: ["upper", "capitalize", "title", "startcase"], c: 1, r: "capitalize()입니다. [cite: 312]" },
    { q: "try 블록에서 오류가 발생했을 때만 실행되는 블록은?", a: ["try", "except", "finally", "else"], c: 1, r: "except 블록입니다. [cite: 85]" },
    { q: "코드 재사용, 모듈화를 위한 코드 집합은?", a: ["변수", "제어문", "함수", "자료형"], c: 2, r: "함수(Function)입니다. [cite: 21]" },
    { q: "Python 클래스에서 객체 생성 시 자동 호출되는 생성자는?", a: ["__init__", "__new__", "constructor", "start"], c: 0, r: "__init__입니다. [cite: 212]" },
    { q: "자료형이 결정할 수 있는 가장 중요한 요소는?", a: ["변수 이름", "메모리 크기", "실행 속도", "가독성"], c: 1, r: "메모리 크기를 결정합니다. [cite: 7]" },
    { q: "프로세스 내에서 실행되는 흐름의 단위는?", a: ["프로세서", "스레드", "어셈블리", "인스턴스"], c: 1, r: "스레드(thread)입니다. [cite: 247]" },
    { q: "모든 언어에서 클래스명에 사용하는 표기법은?", a: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"], c: 1, r: "PascalCase입니다. [cite: 153]" },
    { q: "Python nonlocal 키워드가 쓰이는 구조는?", a: ["전역", "중첩 함수", "클래스", "단일 함수"], c: 1, r: "중첩 함수 구조에서 사용합니다. [cite: 69]" },
    { q: "내부 스코프 변수가 외부의 같은 이름 변수를 가리는 현상은?", a: ["호이스팅", "클로저", "변수 섀도잉", "모듈화"], c: 2, r: "변수 섀도잉입니다. [cite: 74]" },
    { q: "Python, C, C# 공통으로 사용하는 반복문은?", a: ["do-while", "foreach", "for", "repeat"], c: 2, r: "for문은 공통 요소입니다. [cite: 17]" },
    { q: "C#에서 변수나 함수의 접근 범위를 무엇이라 하는가?", a: ["바운더리", "스코프", "리미트", "에어리어"], c: 1, r: "스코프(Scope)입니다. [cite: 60]" },
    { q: "Python에서 조건 분기 시 사용하는 키워드는?", a: ["switch", "elif", "case", "select"], c: 1, r: "elif입니다. [cite: 15]" }
];

const rawShortData = [
    { q: "데이터를 저장할 수 있는 메모리 공간은?", c: "변수", r: "변수(Variable)입니다. [cite: 3]" },
    { q: "자료형이 실행 시점에 결정되는 방식은?", c: "동적타이핑", r: "동적 타이핑입니다. [cite: 9]" },
    { q: "Python에서 'else if'용 키워드는?", c: "elif", r: "elif입니다. [cite: 15]" },
    { q: "함수에 전달되는 입력값을 무엇이라 하는가?", c: "매개변수", r: "매개변수(Parameter)입니다. [cite: 22]" },
    { q: "함수 실행 결과를 돌려줄 때 사용하는 키워드는?", c: "return", r: "return입니다. [cite: 22]" },
    { q: "객체를 생성하기 위한 템플릿은?", c: "클래스", r: "클래스(Class)입니다. [cite: 197]" },
    { q: "첫 글자 소문자, 중간 대문자 표기법은?", c: "카멜케이스", r: "camelCase입니다. [cite: 147]" },
    { q: "데이터와 메서드를 묶고 내부를 숨기는 원칙은?", c: "캡슐화", r: "캡슐화입니다. [cite: 199]" },
    { q: "기존 특성을 물려받아 확장하는 원칙은?", c: "상속", r: "상속입니다. [cite: 200]" },
    { q: "Python 변수 검색 4단계 줄임말은?", c: "LEGB", r: "Local-Enclosing-Global-Builtin입니다. [cite: 78]" },
    { q: "C# null 입력 시 에러를 내는 메서드는?", c: "parse", r: "int.Parse()입니다. [cite: 327]" },
    { q: "외부 상태를 바꾸지 않는 함수는?", c: "순수함수", r: "순수 함수입니다. [cite: 250]" },
    { q: "Python 중첩 함수에서 외부 변수 수정 키워드는?", c: "nonlocal", r: "nonlocal입니다. [cite: 69]" },
    { q: "C# 같은 어셈블리 내 접근 허용 제한자는?", c: "internal", r: "internal입니다. [cite: 169]" },
    { q: "UML에서 public을 나타내는 기호는?", c: "+", r: "더하기(+)입니다. [cite: 278]" },
    { q: "클래스가 구현해야 할 규약 집합은?", c: "인터페이스", r: "인터페이스입니다. [cite: 308]" },
    { q: "Python 리스트 원본을 정렬하는 메서드는?", c: "sort", r: "sort()입니다. [cite: 319]" },
    { q: "실행 흐름의 최소 단위는?", c: "스레드", r: "스레드(thread)입니다. [cite: 247]" },
    { q: "모든 단어 첫 글자 대문자 표기법은?", c: "파스칼케이스", r: "PascalCase입니다. [cite: 150]" },
    { q: "Python에서 예외 강제 발생 키워드는?", c: "raise", r: "raise입니다. [cite: 106]" },
    { q: "메모리 크기를 결정하는 요소는?", c: "자료형", r: "자료형입니다. [cite: 7]" },
    { q: "언더바(_)를 사용하는 표기법은?", c: "스네이크케이스", r: "snake_case입니다. [cite: 149]" },
    { q: "부모 메서드를 자식에서 재정의하는 것은?", c: "오버라이딩", r: "오버라이딩입니다. [cite: 300]" },
    { q: "UML에서 private을 나타내는 기호는?", c: "-", r: "마이너스(-)입니다. [cite: 278]" },
    { q: "자신을 다시 호출하는 방식은?", c: "재귀", r: "재귀(Recursion)입니다. [cite: 48]" },
    { q: "Python 첫 문자만 대문자로 바꾸는 메서드는?", c: "capitalize", r: "capitalize()입니다. [cite: 312]" },
    { q: "오류 가능 코드를 감싸는 블록은?", c: "try", r: "try 블록입니다. [cite: 85]" },
    { q: "비정상적인 실행 중 오류를 뜻하는 말은?", c: "예외", r: "예외(Exception)입니다. [cite: 82]" },
    { q: "외부 스코프 변수를 기억하는 특성은?", c: "클로저", r: "클로저(Closure)입니다. [cite: 77]" },
    { q: "Python 상수 권장 표기 방식은?", c: "UPPER_CASE", r: "대문자 표기입니다. [cite: 155]" },
    { q: "UML 추상 요소 글자 스타일은?", c: "이탤릭", r: "이탤릭체입니다. [cite: 301]" },
    { q: "데이터 저장 공간의 이름은?", c: "변수", r: "변수입니다. [cite: 3]" },
    { q: "반복적인 작업을 수행하는 명령어 집합은?", c: "반복문", r: "반복문입니다. [cite: 16]" },
    { q: "C# null 입력 시 0을 주는 변환은?", c: "convert", r: "Convert 방식입니다. [cite: 333]" },
    { q: "하나의 통로로 여러 구현을 가지는 원칙은?", c: "다형성", r: "다형성입니다. [cite: 201]" },
    { q: "C main 위에서 함수 정보를 선언하는 것은?", c: "원형", r: "함수 원형입니다. [cite: 30]" },
    { q: "특정 문자로 시작하는지 확인하는 메서드는?", c: "startswith", r: "startswith()입니다. [cite: 315]" },
    { q: "C# 인터페이스 이름 앞 알파벳은?", c: "I", r: "I입니다. [cite: 163]" },
    { q: "단순화하여 핵심만 모델링하는 설계는?", c: "추상화", r: "추상화입니다. [cite: 304]" },
    { q: "함수 내 전역 변수 사용 선언 키워드는?", c: "global", r: "global입니다. [cite: 66]" },
    { q: "자식 클래스만 접근 가능한 제한자는?", c: "protected", r: "protected입니다. [cite: 171]" },
    { q: "내부 변수가 외부 변수를 가리는 현상은?", c: "섀도잉", r: "변수 섀도잉입니다. [cite: 74]" },
    { q: "클래스명 공통 표기법은?", c: "파스칼케이스", r: "PascalCase입니다. [cite: 153]" },
    { q: "C# 예외 처리 코드를 담는 블록은?", c: "catch", r: "catch 블록입니다. [cite: 116]" },
    { q: "기능을 묶어 재사용하는 코드 단위는?", c: "함수", r: "함수입니다. [cite: 21]" },
    { q: "원본 유지하며 정렬 결과를 주는 함수는?", c: "sorted", r: "sorted()입니다. [cite: 321]" },
    { q: "함수명에 언더바를 쓰는 표기법은?", c: "스네이크케이스", r: "snake_case입니다. [cite: 155]" },
    { q: "내부 데이터를 메서드로만 접근하게 제한함?", c: "캡슐화", r: "캡슐화입니다. [cite: 266]" },
    { q: "특정 문자로 끝나는지 확인하는 메서드는?", c: "endswith", r: "endswith()입니다. [cite: 315]" },
    { q: "C# 에러를 수동으로 발생시키는 키워드는?", c: "throw", r: "throw입니다. [cite: 116]" }
];

// 4. 화면 전환 및 설정 함수
function nextToSetup() {
    nickname = document.getElementById('user-name-input').value.trim();
    if (!nickname) { alert("이름을 입력해주세요!"); return; }
    
    document.getElementById('step-name').classList.remove('active');
    document.getElementById('step-setup').classList.add('active');
}

function changeType(type) {
    selectedType = type;
    document.getElementById('type-choice').classList.toggle('selected', type === 'choice');
    document.getElementById('type-short').classList.toggle('selected', type === 'short');
}

function changeCount(num) {
    selectedCount = num;
    [20, 30, 50].forEach(n => {
        document.getElementById('cnt-' + n).classList.toggle('selected', n === num);
    });
}

function startQuiz() {
    const pool = (selectedType === 'choice') ? choiceData : shortData;
    // 랜덤 셔플 후 선택한 개수만큼 자르기
    currentQuizSet = [...pool].sort(() => Math.random() - 0.5).slice(0, selectedCount);
    
    currentIdx = 0;
    score = 0;
    
    document.getElementById('step-setup').classList.remove('active');
    document.getElementById('step-quiz').classList.add('active');
    loadQuestion();
}

// 5. 퀴즈 진행 로직
function loadQuestion() {
    const data = currentQuizSet[currentIdx];
    document.getElementById('progress').innerText = `문제 ${currentIdx + 1} / ${selectedCount}`;
    document.getElementById('question').innerText = data.q;
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    if (selectedType === 'choice') {
        data.a.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.innerText = opt;
            btn.onclick = () => checkChoice(i);
            container.appendChild(btn);
        });
    } else {
        container.innerHTML = `
            <input type="text" id="answer-input" placeholder="정답을 입력하세요" style="width:100%; box-sizing:border-box;">
            <button class="action-btn" onclick="checkShort()" style="margin-top:10px;">제출</button>
        `;
        document.getElementById('answer-input').focus();
    }
}

function checkChoice(idx) {
    const correctIdx = currentQuizSet[currentIdx].c;
    const isCorrect = (idx === correctIdx);
    if(isCorrect) score++;
    showFeedback(isCorrect);
}

function checkShort() {
    const input = document.getElementById('answer-input');
    const userVal = input.value.trim().replace(/\s+/g, '').toLowerCase();
    const correctVal = currentQuizSet[currentIdx].c.replace(/\s+/g, '').toLowerCase();
    
    const isCorrect = (userVal === correctVal);
    if(isCorrect) score++;
    showFeedback(isCorrect);
}

function showFeedback(isCorrect) {
    const fb = document.getElementById('feedback');
    const data = currentQuizSet[currentIdx];
    fb.style.display = 'block';
    
    if (isCorrect) {
        fb.className = "feedback correct";
        fb.innerText = "✅ 정답입니다!\n" + data.r;
    } else {
        fb.className = "feedback wrong";
        const ans = (selectedType === 'choice') ? data.a[data.c] : data.c;
        fb.innerText = `❌ 틀렸습니다. (정답: ${ans})\n` + data.r;
    }
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentIdx++;
    if (currentIdx < selectedCount) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const container = document.getElementById('quiz-container');
    database.ref('results/' + nickname).push({ score, total: selectedCount, date: new Date().toLocaleString() });
    
    container.innerHTML = `
        <div class="step-view active">
            <h2>퀴즈 종료!</h2>
            <p>${nickname}님의 점수</p>
            <h1 style="color:var(--primary); font-size:3rem;">${score} / ${selectedCount}</h1>
            <button class="action-btn" onclick="location.reload()">다시 하기</button>
        </div>
    `;
}