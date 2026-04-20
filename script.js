// 1. Firebase 설정
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

// 2. 변수 관리
let nickname = "";
let selectedType = "choice";
let selectedCount = 20;
let currentQuizSet = [];
let currentIdx = 0;
let score = 0;

// 3. 문제 데이터 (객관식 50개)
const rawChoiceData = [
    { q: "데이터를 저장할 수 있는 메모리 공간은?", a: ["상수", "변수", "함수", "클래스"], c: 1, r: "변수는 데이터를 저장하고 변경할 수 있는 공간입니다." },
    { q: "런타임에 자료형이 결정되는 언어 방식은?", a: ["정적 타이핑", "동적 타이핑", "강타입", "약타입"], c: 1, r: "Python과 JS는 실행 시점에 타입이 결정되는 동적 타이핑을 사용합니다." },
    { q: "C#에서 동일 어셈블리 내 모든 코드에서 접근 가능한 제한자는?", a: ["public", "private", "internal", "protected"], c: 2, r: "internal은 프로젝트 내부에서만 자유롭게 접근 가능합니다." },
    { q: "객체지향 4대 원칙 중 내부 구현을 숨기는 것은?", a: ["상속", "다형성", "캡슐화", "추상화"], c: 2, r: "캡슐화는 정보 은닉을 위해 사용됩니다." },
    { q: "Python LEGB 규칙 중 'E'의 의미는?", a: ["External", "Enclosing", "Entry", "Extended"], c: 1, r: "E는 중첩 함수 범위를 뜻하는 Enclosing입니다." },
    { q: "부모 클래스의 메서드를 자식에서 재정의하는 것은?", a: ["오버로딩", "오버라이딩", "추상화", "캡슐화"], c: 1, r: "메서드 재정의는 오버라이딩(Overriding)입니다." },
    { q: "Python에서 에러를 강제로 발생시키는 키워드는?", a: ["throw", "raise", "error", "except"], c: 1, r: "Python은 raise 키워드를 사용해 예외를 던집니다." },
    { q: "C# 클래스 명명에 권장되는 표기법은?", a: ["camelCase", "snake_case", "PascalCase", "kebab-case"], c: 2, r: "C# 클래스는 PascalCase를 사용합니다." },
    { q: "UML 표기법에서 '-' 기호의 의미는?", a: ["public", "private", "protected", "internal"], c: 1, r: "'-'는 private(비공개)를 의미합니다." },
    { q: "프로세스 내 실행 흐름의 최소 단위는?", a: ["프로세서", "스레드", "어셈블리", "인스턴스"], c: 1, r: "스레드는 프로세스 내 작업의 흐름입니다." },
    { q: "순수 함수의 특징은?", a: ["부수 효과 발생", "상태 변경", "동일 입력 시 동일 결과", "랜덤 값 반환"], c: 2, r: "순수 함수는 외부 상태를 건드리지 않습니다." },
    { q: "Python 함수 선언 키워드는?", a: ["function", "def", "func", "static"], c: 1, r: "Python은 def로 함수를 만듭니다." },
    { q: "C# int.Parse()에 null 입력 시?", a: ["0 반환", "에러 발생", "null 반환", "-1 반환"], c: 1, r: "int.Parse는 null에 대해 예외를 발생시킵니다." },
    { q: "함수 외부 변수를 기억하는 특성은?", a: ["호이스팅", "섀도잉", "클로저", "캡슐화"], c: 2, r: "클로저는 함수가 생성될 때의 환경을 기억합니다." },
    { q: "UML에서 이탤릭체(기울임)로 표시되는 것은?", a: ["정적 메서드", "추상 메서드", "비공개 메서드", "공개 메서드"], c: 1, r: "추상은 이탤릭체로 표기합니다." },
    { q: "Python 문자열 시작 검사 메서드는?", a: ["find", "startswith", "endswith", "index"], c: 1, r: "startswith() 메서드입니다." },
    { q: "C# 자식 클래스만 접근 가능한 제한자는?", a: ["private", "protected", "internal", "public"], c: 1, r: "protected는 상속 관계에서만 허용됩니다." },
    { q: "매개변수에 따라 다르게 작동하는 다형성은?", a: ["오버라이딩", "오버로딩", "추상화", "캡슐화"], c: 1, r: "정적 다형성인 오버로딩(Overloading)입니다." },
    { q: "Python 객체 생성 시 자동 호출되는 생성자는?", a: ["__init__", "__new__", "constructor", "Person"], c: 0, r: "__init__이 생성자입니다." },
    { q: "데이터 변경을 금지하는 원칙은?", a: ["순수성", "불변성", "다형성", "캡슐화"], c: 1, r: "불변성(Immutability)입니다." },
    { q: "Python 전역 변수 수정 키워드는?", a: ["local", "nonlocal", "global", "static"], c: 2, r: "global 선언이 필요합니다." },
    { q: "C# 필드 접근 제어 get/set 기능은?", a: ["메서드", "프로퍼티", "생성자", "이벤트"], c: 1, r: "프로퍼티(Property)입니다." },
    { q: "Python 리스트 원본을 직접 정렬하는 것은?", a: ["sorted()", "sort()", "order()", "arrange()"], c: 1, r: "sort()는 리스트 자체를 정렬합니다." },
    { q: "UML에서 '+' 기호의 의미는?", a: ["private", "public", "protected", "internal"], c: 1, r: "'+'는 public(공개)을 의미합니다." },
    { q: "내부 변수가 외부 변수를 가리는 현상은?", a: ["클로저", "호이스팅", "섀도잉", "모듈화"], c: 2, r: "변수 섀도잉(Shadowing)입니다." },
    { q: "C#에서 에러를 던지는 키워드는?", a: ["raise", "throw", "emit", "send"], c: 1, r: "C#은 throw를 사용합니다." },
    { q: "첫 글자 소문자, 중간 대문자 명명법은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 1, r: "camelCase입니다." },
    { q: "Python 스코프 검색 마지막 단계는?", a: ["Local", "Global", "Enclosing", "Built-in"], c: 3, r: "Built-in이 최종 단계입니다." },
    { q: "C# 인터페이스 이름 앞에 붙는 문자는?", a: ["C", "A", "I", "T"], c: 2, r: "관습적으로 'I'를 붙입니다." },
    { q: "핵심만 모델링하고 세부사항을 감추는 원칙은?", a: ["상속", "추상화", "다형성", "캡슐화"], c: 1, r: "추상화(Abstraction)입니다." },
    { q: "항상 같은 결과를 내는 함수 성질은?", a: ["멱등성", "순수성", "원자성", "독립성"], c: 1, r: "순수 함수의 순수성입니다." },
    { q: "Python 외부 함수 변수 수정 키워드는?", a: ["global", "nonlocal", "local", "outer"], c: 1, r: "nonlocal을 사용합니다." },
    { q: "정적 타이핑 언어는?", a: ["Python", "JavaScript", "C#", "Ruby"], c: 2, r: "C#은 정적 타이핑 언어입니다." },
    { q: "오류 발생 시 실행되는 블록은?", a: ["try", "catch", "finally", "else"], c: 1, r: "catch(또는 except) 블록입니다." },
    { q: "C언어 main 이전 함수 정보 선언은?", a: ["함수 본문", "함수 원형", "매개변수", "반환값"], c: 1, r: "함수 원형(Prototype)입니다." },
    { q: "Python 첫 문자만 대문자로 만드는 메서드는?", a: ["upper()", "capitalize()", "title()", "lower()"], c: 1, r: "capitalize()입니다." },
    { q: "C# 상수 명명법은?", a: ["camelCase", "snake_case", "PascalCase", "kebab-case"], c: 2, r: "C# 상수는 PascalCase를 권장합니다." },
    { q: "컴파일 시점에 타입 검사를 하는 방식은?", a: ["정적 검사", "동적 검사", "강타입", "약타입"], c: 0, r: "정적 타입 검사입니다." },
    { q: "Python 원본 유지 정렬 내장 함수는?", a: ["sort()", "sorted()", "reverse()", "filter()"], c: 1, r: "sorted()는 복사본을 반환합니다." },
    { q: "계층 구조 형성을 돕는 원칙은?", a: ["캡슐화", "상속", "추상화", "다형성"], c: 1, r: "상속(Inheritance)입니다." },
    { q: "C# 복잡한 로직용 필드 방식은?", a: ["정적 필드", "백킹 필드", "공개 필드", "매개변수"], c: 1, r: "백킹 필드(Backing Field)입니다." },
    { q: "언더바(_)를 사용하는 명명법은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 2, r: "snake_case입니다." },
    { q: "Python 상수 명명법은?", a: ["PascalCase", "camelCase", "UPPER_CASE", "snake_case"], c: 2, r: "대문자 위주로 씁니다." },
    { q: "자료형이 결정하는 것은?", a: ["변수 이름", "메모리 크기", "실행 순서", "함수 이름"], c: 1, r: "메모리 크기를 결정합니다." },
    { q: "선언이 최상단으로 옮겨지는 현상은?", a: ["클로저", "호이스팅", "섀도잉", "모듈화"], c: 1, r: "호이스팅(Hoisting)입니다." },
    { q: "C# null을 0으로 바꾸는 변환은?", a: ["int.Parse", "Convert.ToInt32", "ToString", "Cast"], c: 1, r: "Convert 방식입니다." },
    { q: "자신을 다시 호출하는 함수는?", a: ["고차 함수", "순수 함수", "재귀 함수", "내장 함수"], c: 2, r: "재귀 함수입니다." },
    { q: "UML 추상 클래스 명칭 표기는?", a: ["굵게", "기울임", "밑줄", "대문자"], c: 1, r: "이탤릭체로 표기합니다." },
    { q: "Python 리스트 내림차순 정렬은?", a: ["sort()", "sort(reverse=True)", "reverse()", "down_sort()"], c: 1, r: "reverse=True를 인자로 줍니다." },
    { q: "함수가 인자로 전달 가능한 특징은?", a: ["일급 객체", "정적 필드", "캡슐화", "추상화"], c: 0, r: "일급 객체(First-class object) 성질입니다." }
];

// 4. 단답형 데이터 (50개)
const rawShortData = [
    { q: "데이터를 저장할 수 있는 메모리 공간은?", c: "변수", r: "변수입니다." },
    { q: "런타임에 자료형이 결정되는 방식은?", c: "동적타이핑", r: "동적 타이핑입니다." },
    { q: "C# 동일 어셈블리 내 접근 가능 제한자는?", c: "internal", r: "internal입니다." },
    { q: "Python 변수 검색 규칙 4단계 명칭은?", c: "LEGB", r: "LEGB입니다." },
    { q: "외부 상태를 바꾸지 않는 함수의 이름은?", c: "순수함수", r: "순수 함수입니다." },
    { q: "데이터와 메서드를 하나로 묶는 원칙은?", c: "캡슐화", r: "캡슐화입니다." },
    { q: "C# null 입력 시 에러를 내는 변환 메서드는?", c: "parse", r: "int.Parse()입니다." },
    { q: "부모 메서드를 자식에서 재정의하는 것은?", c: "오버라이딩", r: "오버라이딩입니다." },
    { q: "Python 예외 강제 발생 키워드는?", c: "raise", r: "raise입니다." },
    { q: "C# 클래스 명명 권장 표기법은?", c: "파스칼케이스", r: "PascalCase입니다." },
    { q: "UML 비공개(private) 기호는?", c: "-", r: "마이너스(-)입니다." },
    { q: "C# Convert에 null 입력 시 결과 숫자는?", c: "0", r: "0입니다." },
    { q: "자신을 다시 호출하는 기법은?", c: "재귀", r: "재귀(Recursion)입니다." },
    { q: "문자열 시작 확인 메서드 이름은?", c: "startswith", r: "startswith입니다." },
    { q: "핵심만 모델링하는 설계 원칙은?", c: "추상화", r: "추상화입니다." },
    { q: "Python 리스트 자체 정렬 메서드는?", c: "sort", r: "sort()입니다." },
    { q: "상속 관계에서만 접근 가능한 제한자는?", c: "protected", r: "protected입니다." },
    { q: "암묵적 타입 변환이 잦은 언어 특징은?", c: "약타입", r: "약타입입니다." },
    { q: "중첩 함수에서 외부 변수 수정 키워드는?", c: "nonlocal", r: "nonlocal입니다." },
    { q: "컴파일 시점에 타입을 체크하는 것은?", c: "정적타입검사", r: "정적 타입 검사입니다." },
    { q: "첫 글자 소문자, 중간 대문자 표기법은?", c: "카멜케이스", r: "camelCase입니다." },
    { q: "다양한 형태의 구현을 가지는 원칙은?", c: "다형성", r: "다형성입니다." },
    { q: "Python 정렬된 새 리스트 반환 함수는?", c: "sorted", r: "sorted()입니다." },
    { q: "C# 인터페이스 이름 앞 대문자는?", c: "I", r: "I입니다." },
    { q: "UML 공개(public) 기호는?", c: "+", r: "플러스(+)입니다." },
    { q: "C# 오류 강제 발생 키워드는?", c: "throw", r: "throw입니다." },
    { q: "언더바(_) 사용 명명법은?", c: "스네이크케이스", r: "snake_case입니다." },
    { q: "오류 감시용 코드 블록 이름은?", c: "try", r: "try 블록입니다." },
    { q: "Python 대문자 전용 변수 의미는?", c: "상수", r: "상수입니다." },
    { q: "C# 필드 제어 구문 명칭은?", c: "프로퍼티", r: "프로퍼티입니다." },
    { q: "추상 메서드 표기용 글씨체는?", c: "이탤릭", r: "이탤릭체입니다." },
    { q: "기존 기능을 물려받는 원칙은?", c: "상속", r: "상속입니다." },
    { q: "데이터 변경 금지 원칙은?", c: "불변성", r: "불변성입니다." },
    { q: "Python 생성자 메서드 이름은?", c: "__init__", r: "__init__입니다." },
    { q: "C언어 관습 명명법은?", c: "스네이크케이스", r: "snake_case입니다." },
    { q: "함수 내 전역 변수 선언 키워드는?", c: "global", r: "global입니다." },
    { q: "런타임에 타입을 체크하는 것은?", c: "동적타입검사", r: "동적 타입 검사입니다." },
    { q: "함수를 주고받는 함수 명칭은?", c: "고차함수", r: "고차 함수입니다." },
    { q: "첫 문자만 대문자화하는 메서드는?", c: "capitalize", r: "capitalize입니다." },
    { q: "매개변수에 따른 중복 정의는?", c: "오버로딩", r: "오버로딩입니다." },
    { q: "자유로운 외부 접근 제한자는?", c: "public", r: "public입니다." },
    { q: "이름이 같아 변수가 가려지는 현상은?", c: "섀도잉", r: "섀도잉입니다." },
    { q: "타입 명시가 없는 Python의 특징은?", c: "동적타이핑", r: "동적 타이핑입니다." },
    { q: "실행 흐름의 단위는?", c: "스레드", r: "스레드입니다." },
    { q: "UML '#' 기호의 의미는?", c: "protected", r: "protected입니다." },
    { q: "C# 상수 선언 키워드는?", c: "const", r: "const입니다." },
    { q: "Python if/else 사이의 키워드는?", c: "elif", r: "elif입니다." },
    { q: "메모리 크기를 정하는 것은?", c: "자료형", r: "자료형입니다." },
    { q: "반환값 없는 함수의 키워드는?", c: "void", r: "void입니다." },
    { q: "클래스의 실체 객체 명칭은?", c: "인스턴스", r: "인스턴스입니다." }
];

// 5. 로직 구현부
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
            <input type="text" id="short-answer-input" placeholder="정답 입력 후 엔터">
            <button class="start-btn" onclick="checkShortAnswer()" style="width:100%; margin-top:10px;">제출</button>
        `;
        document.getElementById('short-answer-input').focus();
        document.getElementById('short-answer-input').addEventListener('keypress', (e) => {
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
    const input = document.getElementById('short-answer-input');
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
            <button class="start-btn" onclick="location.reload()" style="width: 100%;">처음으로 돌아가기</button>
        </div>
    `;
}