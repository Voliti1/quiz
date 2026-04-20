// 퀴즈 데이터베이스 (총 40문제)
const quizData = [
    // [객관식 20문제]
    { 
        q: "변수의 특징으로 옳지 않은 것은?", 
        a: ["데이터를 저장하는 메모리 공간", "초기값은 종료 시까지 변경 불가", "데이터 재사용 가능", "자료형에 따라 메모리 크기 결정"], 
        c: 1, 
        r: "변수는 이름 그대로 값을 변경할 수 있는 성질을 가집니다." 
    },
    { 
        q: "Python처럼 실행 시점에 자료형이 결정되는 방식은?", 
        a: ["정적 타이핑", "강타입", "동적 타이핑", "약타입"], 
        c: 2, 
        r: "실행 중(Runtime)에 타입이 결정되는 것은 동적 타이핑입니다." 
    },
    { 
        q: "C언어에서 함수 원형을 선언하는 일반적인 관습은?", 
        a: ["main() 함수 아래에 선언", "main() 위에 선언, 정의는 아래에", "반드시 main() 안에서만 정의", "선언이 전혀 필요 없음"], 
        c: 1, 
        r: "구조 파악을 위해 원형 선언은 상단에, 실제 구현은 하단에 두는 것이 관례입니다." 
    },
    { 
        q: "Python 중첩 함수에서 외부 함수의 변수를 수정할 때 사용하는 키워드는?", 
        a: ["global", "external", "local", "nonlocal"], 
        c: 3, 
        r: "상위 스코프의 변수를 참조/수정할 때는 nonlocal을 사용합니다." 
    },
    { 
        q: "C# 접근 제한자 중 '같은 어셈블리 내'에서만 접근 가능한 것은?", 
        a: ["public", "private", "internal", "protected"], 
        c: 2, 
        r: "internal은 동일한 프로젝트(어셈블리) 내에서의 접근을 허용합니다." 
    },
    { 
        q: "Python 변수 검색 규칙인 LEGB의 순서로 옳은 것은?", 
        a: ["Local-Enclosing-Global-Builtin", "Global-Local-Enclosing-Builtin", "Local-Global-Enclosing-Builtin", "Builtin-Global-Enclosing-Local"], 
        c: 0, 
        r: "가장 좁은 지역 범위(L)부터 가장 넓은 내장 범위(B) 순으로 탐색합니다." 
    },
    { 
        q: "예외 처리(try-except)보다 if문을 사용하는 것이 권장되는 경우는?", 
        a: ["DB 접근 시", "치명적인 오류 발생 시", "파일 시스템 접근 시", "충분히 예상 가능한 상황 처리 시"], 
        c: 3, 
        r: "예외 처리는 비용이 크므로, 로직으로 처리 가능한 예견된 상황은 if문이 효율적입니다." 
    },
    { 
        q: "약타입 언어(JavaScript 등)의 특징은?", 
        a: ["타입 엄격 유지", "암묵적 타입 변환 발생", "자동 변환 절대 금지", "컴파일 시 모든 타입 검사"], 
        c: 1, 
        r: "약타입 언어는 연산 시 내부적으로 자동 형변환을 수행하는 경우가 많습니다." 
    },
    { 
        q: "첫 글자는 소문자, 중간 단어는 대문자로 표기하는 관례는?", 
        a: ["snake_case", "PascalCase", "camelCase", "kebab-case"], 
        c: 2, 
        r: "낙타의 등 모양과 닮았다고 하여 camelCase라고 부릅니다." 
    },
    { 
        q: "데이터와 메서드를 하나로 묶어 내부 구현을 숨기는 원칙은?", 
        a: ["상속", "다형성", "캡슐화", "추상화"], 
        c: 2, 
        r: "캡슐화는 정보 은닉을 통해 객체의 독립성을 높입니다." 
    },
    { 
        q: "C# int.Parse(input) 사용 시 input이 null이면?", 
        a: ["0 반환", "빈 문자열 반환", "에러(Exception) 발생", "True 반환"], 
        c: 2, 
        r: "Parse는 null 입력 시 예외를 발생시키므로 주의해야 합니다." 
    },
    { 
        q: "함수형 프로그래밍의 특징으로 옳지 않은 것은?", 
        a: ["순수 함수 사용", "데이터 불변성", "명령어의 순차적 상태 변경 중심", "고차 함수 활용"], 
        c: 2, 
        r: "상태 변경 중심은 절차적 프로그래밍의 특징입니다." 
    },
    { 
        q: "C#의 internal 제한자의 허용 범위는?", 
        a: ["프로젝트(어셈블리) 내", "파일 내", "전역", "상속 관계의 외부 프로젝트"], 
        c: 0, 
        r: "동일한 바이너리 파일(dll, exe) 단위인 어셈블리 내를 의미합니다." 
    },
    { 
        q: "Python에서 원본 리스트를 유지하며 정렬된 결과를 얻는 함수는?", 
        a: ["data.sort()", "sorted(data)", "data.arrange()", "data.order()"], 
        c: 1, 
        r: "sorted()는 원본 수정 없이 새로운 정렬 리스트를 반환합니다." 
    },
    { 
        q: "UML 표기법에서 '-' 부호의 의미는?", 
        a: ["public", "private", "protected", "static"], 
        c: 1, 
        r: "마이너스(-)는 비공개인 private을 의미합니다." 
    },
    { 
        q: "상속받은 메서드를 자식 클래스에서 재정의하는 것은?", 
        a: ["오버로딩", "오버라이딩", "캡슐화", "추상화"], 
        c: 1, 
        r: "부모의 기능을 덮어쓰는 것을 오버라이딩(Overriding)이라고 합니다." 
    },
    { 
        q: "Python에서 예외를 강제로 발생시키는 키워드는?", 
        a: ["throw", "except", "raise", "error"], 
        c: 2, 
        r: "Python에서는 raise를 사용해 예외를 던집니다." 
    },
    { 
        q: "객체지향 설계 시 유연성을 얻는 대신 발생하는 성능 저하 현상은?", 
        a: ["메모리 릭", "오버헤드", "데드락", "섀도잉"], 
        c: 1, 
        r: "추가적인 처리 과정에서 발생하는 시스템 부하를 오버헤드라고 합니다." 
    },
    { 
        q: "C# 인터페이스 명명 관례로 옳은 것은?", 
        a: ["뒤에 Interface 붙임", "언더바로 시작", "대문자 'I'로 시작", "모두 대문자"], 
        c: 2, 
        r: "IComparable 처럼 대문자 I를 붙이는 것이 표준입니다." 
    },
    { 
        q: "Python 문자열의 첫 글자만 대문자로 바꾸는 메서드는?", 
        a: ["upper()", "capitalize()", "title()", "first_upper()"], 
        c: 1, 
        r: "capitalize()는 문장의 첫 글자만 대문자로 처리합니다." 
    },

    // [단답형 대체 객관식 20문제]
    { 
        q: "데이터를 저장하기 위해 할당된 메모리 공간의 명칭은?", 
        a: ["자료형", "상수", "변수", "함수"], 
        c: 2, 
        r: "변수(Variable)에 대한 설명입니다." 
    },
    { 
        q: "프로세스 내부에서 실제로 작업을 수행하는 실행 흐름의 단위는?", 
        a: ["프로세스", "스레드(Thread)", "메서드", "모듈"], 
        c: 1, 
        r: "실행 흐름의 최소 단위를 스레드라고 합니다." 
    },
    { 
        q: "Python에서 부모 클래스의 자원에 접근할 때 사용하는 키워드는?", 
        a: ["this", "parent", "super()", "base"], 
        c: 2, 
        r: "super()를 통해 부모 클래스의 메서드나 생성자에 접근합니다." 
    },
    { 
        q: "입력값이 같으면 결과가 항상 같고 부수 효과가 없는 함수는?", 
        a: ["익명 함수", "순수 함수", "내장 함수", "재귀 함수"], 
        c: 1, 
        r: "순수 함수(Pure Function)의 정의입니다." 
    },
    { 
        q: "변수나 함수가 유효하게 작동하는 코드의 범위는?", 
        a: ["라이프타임", "스코프(Scope)", "블록", "네임스페이스"], 
        c: 1, 
        r: "변수의 가시 범위를 스코프라고 합니다." 
    },
    { 
        q: "내부 변수가 외부의 같은 이름 변수를 가리는 현상은?", 
        a: ["호이스팅", "클로저", "변수 섀도잉", "캡슐화"], 
        c: 2, 
        r: "가까운 스코프의 변수가 우선시되는 섀도잉 현상입니다." 
    },
    { 
        q: "Python 코드 스타일(PEP 8) 위반을 검사하는 도구는?", 
        a: ["black", "flake8", "npm", "pip"], 
        c: 1, 
        r: "flake8은 스타일 가이드를 준수하는지 확인해줍니다." 
    },
    { 
        q: "C#에서 get/set을 사용하여 필드 접근을 제어하는 기능은?", 
        a: ["필드", "생성자", "프로퍼티", "이벤트"], 
        c: 2, 
        r: "속성을 의미하는 프로퍼티(Property)입니다." 
    },
    { 
        q: "실행 전 컴파일 시점에 타입을 체크하는 방식은?", 
        a: ["정적 타입 검사", "동적 타입 검사", "유닛 테스트", "정적 분석"], 
        c: 0, 
        r: "정적(Static) 타입 검사에 대한 설명입니다." 
    },
    { 
        q: "C# Convert.ToInt32()에 null을 넣었을 때의 결과값은?", 
        a: ["에러 발생", "0", "-1", "null"], 
        c: 1, 
        r: "Convert 메서드는 null을 0으로 안전하게 반환합니다." 
    },
    { 
        q: "핵심 개념만 남기고 세부사항은 감추어 단순화하는 원칙은?", 
        a: ["상속", "다형성", "추상화", "모듈화"], 
        c: 2, 
        r: "추상화(Abstraction)에 대한 설명입니다." 
    },
    { 
        q: "Python에서 외부 자원 접근 시 예외 처리를 위해 쓰는 구문은?", 
        a: ["if-else", "try-except", "while", "for"], 
        c: 1, 
        r: "에러 발생 가능성에 대비하는 try-except 문입니다." 
    },
    { 
        q: "C#에서 상수를 정의할 때 권장되는 명명 규칙은?", 
        a: ["camelCase", "snake_case", "PascalCase", "UPPER_CASE"], 
        c: 2, 
        r: "C#은 상수에도 PascalCase 사용을 권장합니다." 
    },
    { 
        q: "함수가 생성될 당시의 스코프를 기억하여 외부에서 접근하는 특성은?", 
        a: ["호이스팅", "클로저(Closure)", "데코레이터", "제너레이터"], 
        c: 1, 
        r: "함수 환경을 폐쇄하여 유지하는 클로저입니다." 
    },
    { 
        q: "C언어의 메모리 누수나 오류를 실시간으로 검사하는 도구는?", 
        a: ["cppcheck", "Valgrind", "clang-format", "gcc"], 
        c: 1, 
        r: "Valgrind는 강력한 메모리 디버깅 도구입니다." 
    },
    { 
        q: "C# int.Parse()에 빈 문자열(\"\")을 넣으면?", 
        a: ["0", "null", "에러 발생", "-1"], 
        c: 2, 
        r: "형식 오류(FormatException)가 발생합니다." 
    },
    { 
        q: "기존 코드를 물려받아 새로운 클래스를 만드는 원칙은?", 
        a: ["상속", "캡슐화", "추상화", "모듈화"], 
        c: 0, 
        r: "재사용의 핵심인 상속(Inheritance)입니다." 
    },
    { 
        q: "C# try 문 뒤에 에러를 처리하기 위해 붙는 블록은?", 
        a: ["except", "catch", "finally", "else"], 
        c: 1, 
        r: "catch 블록에서 예외를 처리합니다." 
    },
    { 
        q: "모든 언어에서 클래스 이름에 공통적으로 권장되는 표기법은?", 
        a: ["camelCase", "PascalCase", "snake_case", "kebab-case"], 
        c: 1, 
        r: "클래스는 대문자로 시작하는 PascalCase가 표준입니다." 
    },
    { 
        q: "Python에서 특정 문자로 끝나는지 확인하는 메서드는?", 
        a: ["startswith()", "endswith()", "contains()", "find()"], 
        c: 1, 
        r: "endswith()를 통해 접미사를 확인할 수 있습니다." 
    }
];

// 아래부터는 퀴즈 실행 로직 (index.html에서 호출)
let currentIdx = 0;
let score = 0;

function loadQuestion() {
    const data = quizData[currentIdx];
    document.getElementById('progress').innerText = `QUESTION ${currentIdx + 1} / ${quizData.length}`;
    document.getElementById('question').innerText = data.q;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    data.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        optionsDiv.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const data = quizData[currentIdx];
    const feedback = document.getElementById('feedback');
    const options = document.getElementsByClassName('option');
    for(let btn of options) btn.disabled = true;

    if(selected === data.c) {
        feedback.innerText = "✅ 정답입니다! \n" + data.r;
        feedback.className = "feedback correct";
        score++;
    } else {
        feedback.innerText = `❌ 틀렸습니다. \n 정답: [${data.a[data.c]}] \n ${data.r}`;
        feedback.className = "feedback wrong";
    }
    feedback.style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentIdx++;
    if(currentIdx < quizData.length) loadQuestion();
    else showResult();
}

function showResult() {
    const container = document.getElementById('quiz-content');
    const percent = Math.round((score / quizData.length) * 100);
    container.innerHTML = `
        <div class="summary">
            <h2>퀴즈 완료!</h2>
            <p class="score-text">${score} / ${quizData.length} 정답</p>
            <p>정답률: ${percent}%</p>
            <button class="retry-btn" onclick="location.reload()">다시 풀기</button>
        </div>`;
}

loadQuestion();