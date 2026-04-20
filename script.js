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

// 전역 변수 설정
let nickname = ""; 
let currentIdx = 0;
let score = 0;

// 2. 퀴즈 데이터 (객관식 50개 + 단답형 50개 = 총 100개) - 문서 기반 업데이트
const quizData = [
    // [객관식 50문제]
    { type: 'choice', q: "변수의 특징으로 옳지 않은 것은?", a: ["데이터 저장 메모리 공간", "초기값 할당 가능", "한 번 설정하면 변경 불가", "재사용 가능"], c: 2, r: "변수는 초기값 할당 후 변경이 가능합니다." },
    { type: 'choice', q: "Python과 같이 런타임에 자료형이 결정되는 언어 방식은?", a: ["정적 타이핑", "강타입", "동적 타이핑", "약타입"], c: 2, r: "실행 시점에 결정되는 것은 동적 타이핑입니다." },
    { type: 'choice', q: "C#에서 같은 어셈블리 내의 모든 코드에서 접근 가능하게 하는 제한자는?", a: ["public", "private", "internal", "protected"], c: 2, r: "internal은 동일 어셈블리(.exe, .dll) 내에서 접근 가능합니다." },
    { type: 'choice', q: "Python LEGB 규칙 중 'E'가 의미하는 범위는?", a: ["External", "Enclosing", "Entry", "Else"], c: 1, r: "Enclosing(중첩 함수 범위)입니다." },
    { type: 'choice', q: "순수 함수의 특징으로 옳은 것은?", a: ["상태 변경 중심", "동일 입력 시 동일 결과 반환", "매개변수 없음", "랜덤 결과 생성"], c: 1, r: "순수 함수는 외부 상태를 변경하지 않고 동일 입력-동일 결과를 보장합니다." },
    { type: 'choice', q: "객체지향 4대 원칙이 아닌 것은?", a: ["캡슐화", "상속", "컴파일", "추상화"], c: 2, r: "캡슐화, 상속, 다형성, 추상화가 핵심 원칙입니다." },
    { type: 'choice', q: "C# int.Parse()에 null 입력 시 발생하는 결과는?", a: ["0 반환", "에러 발생", "null 반환", "-1"], c: 1, r: "int.Parse는 null 입력 시 에러(예외)가 발생합니다." },
    { type: 'choice', q: "UML 표기법에서 '-' 기호가 의미하는 접근 제한은?", a: ["공개(public)", "패키지", "비공개(private)", "보호(protected)"], c: 2, r: "마이너스(-)는 private을 의미합니다." },
    { type: 'choice', q: "부모 클래스의 메서드를 자식에서 재정의하는 동적 다형성은?", a: ["오버로딩", "오버라이딩", "캡슐화", "추상화"], c: 1, r: "오버라이딩(Overriding)입니다." },
    { type: 'choice', q: "Python에서 의도적으로 예외를 발생시키는 키워드는?", a: ["throw", "raise", "error", "except"], c: 1, r: "Python은 raise 키워드를 사용합니다." },
    { type: 'choice', q: "C#에서 권장하는 클래스 및 메서드 명명법은?", a: ["camelCase", "PascalCase", "snake_case", "kebab-case"], c: 1, r: "C# 클래스와 메서드는 PascalCase를 권장합니다." },
    { type: 'choice', q: "데이터의 불변성을 강조하며 함수를 변수처럼 다루는 패러다임은?", a: ["절차적", "객체지향", "함수형", "명령형"], c: 2, r: "함수형 프로그래밍의 특징입니다." },
    { type: 'choice', q: "C# 접근 제한자 중 상속 관계인 클래스만 접근을 허용하는 것은?", a: ["public", "private", "protected", "internal"], c: 2, r: "protected입니다." },
    { type: 'choice', q: "Python에서 원본 리스트를 유지하며 정렬된 새 결과를 반환하는 함수는?", a: ["sort()", "sorted()", "order()", "arrange()"], c: 1, r: "sorted()는 원본을 바꾸지 않습니다." },
    { type: 'choice', q: "UML 표기법에서 '+' 기호가 의미하는 것은?", a: ["private", "public", "protected", "internal"], c: 1, r: "플러스(+)는 public을 의미합니다." },
    { type: 'choice', q: "C#에서 get과 set을 사용하여 필드 접근을 제어하는 기능은?", a: ["필드", "프로퍼티", "생성자", "이벤트"], c: 1, r: "프로퍼티(Property)입니다." },
    { type: 'choice', q: "Python 변수 탐색 우선순위(LEGB) 중 가장 먼저 검색하는 곳은?", a: ["Global", "Built-in", "Local", "Enclosing"], c: 2, r: "Local(지역) 범위를 가장 먼저 찾습니다." },
    { type: 'choice', q: "예상 가능한 상황을 처리할 때 적합한 도구는?", a: ["try-except", "조건문(if)", "raise", "throw"], c: 1, r: "예상 가능하면 조건문, 예상치 못한 상황엔 예외 처리를 사용합니다." },
    { type: 'choice', q: "C언어에서 main() 함수 이전에 함수 정보를 알리는 선언은?", a: ["함수 본문", "함수 원형", "매개변수", "반환값"], c: 1, r: "함수 원형(Prototype) 선언입니다." },
    { type: 'choice', q: "Python 문자열의 시작 부분을 검사하는 메서드는?", a: ["startswith", "endswith", "find", "index"], c: 0, r: "startswith()입니다." },
    { type: 'choice', q: "C# Convert.ToInt32(null)의 결과값은?", a: ["0", "에러 발생", "null", "-1"], c: 0, r: "Convert 방식은 null 입력 시 0을 반환합니다." },
    { type: 'choice', q: "핵심만 모델링하고 불필요한 세부사항을 감추는 원칙은?", a: ["상속", "다형성", "추상화", "캡슐화"], c: 2, r: "추상화(Abstraction)입니다." },
    { type: 'choice', q: "컴파일 시점에 타입 검사를 수행하는 언어의 특징은?", a: ["유연성 높음", "버그 조기 발견", "런타임 오류 증가", "프로토타이핑 유리"], c: 1, r: "정적 타입 검사는 안정성이 높고 버그를 미리 찾습니다." },
    { type: 'choice', q: "Python에서 변수와 함수명에 권장되는 표기법은?", a: ["PascalCase", "snake_case", "camelCase", "UPPER_CASE"], c: 1, r: "Python 변수/함수는 snake_case를 사용합니다." },
    { type: 'choice', q: "Python에서 부모 클래스의 메서드를 호출할 때 사용하는 키워드는?", a: ["base", "parent", "super", "this"], c: 2, r: "Python은 super()를 사용합니다." },
    { type: 'choice', q: "함수 내부에서 자신을 다시 호출할 때 주의할 점은?", a: ["무한루프", "무한재귀", "전역변수 오염", "타입 불일치"], c: 1, r: "재귀 함수는 무한재귀에 빠지지 않도록 주의해야 합니다." },
    { type: 'choice', q: "정의된 스코프 외부에서도 그 안의 변수를 기억하는 특성은?", a: ["호이스팅", "섀도잉", "클로저", "데코레이터"], c: 2, r: "클로저(Closure)의 정의입니다." },
    { type: 'choice', q: "C#에서 인터페이스 이름 앞에 관습적으로 붙이는 문자는?", a: ["A", "C", "I", "T"], c: 2, r: "대문자 I를 붙여 명명합니다." },
    { type: 'choice', q: "Python에서 함수 내부에서 전역 변수를 수정하기 위한 키워드는?", a: ["local", "nonlocal", "global", "external"], c: 2, r: "global 키워드가 필요합니다." },
    { type: 'choice', q: "Python nonlocal 키워드의 필수 조건은?", a: ["전역 변수 존재", "외부 함수에 변수 존재", "클래스 내부", "정적 변수"], c: 1, r: "반드시 외부 함수에 해당 변수가 이미 존재해야 합니다." },
    { type: 'choice', q: "변수와 값의 타입이 엄격하게 유지되는 언어의 특징은?", a: ["약타입", "강타입", "동적 타입", "암묵적 변환"], c: 1, r: "허용되지 않은 타입 변환을 막는 것은 강타입입니다." },
    { type: 'choice', q: "매개변수의 타입이나 개수에 따라 다르게 작동하는 다형성은?", a: ["오버라이딩", "오버로딩", "추상화", "캡슐화"], c: 1, r: "정적 다형성인 오버로딩(Overloading)입니다." },
    { type: 'choice', q: "C#에서 상수와 정적 필드에 권장되는 표기법은?", a: ["camelCase", "PascalCase", "snake_case", "kebab-case"], c: 1, r: "C# 상수는 PascalCase를 주로 사용합니다." },
    { type: 'choice', q: "첫 글자를 대문자로, 중간 단어 첫 글자도 대문자로 쓰는 방식은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 0, r: "첫 글자부터 대문자면 PascalCase입니다." },
    { type: 'choice', q: "Python에서 지원하지 않는 반복문 유형은?", a: ["for", "while", "do-while", "nested for"], c: 2, r: "Python에는 do-while문이 없습니다." },
    { type: 'choice', q: "UML에서 추상(abstract) 메서드를 나타내는 스타일은?", a: ["굵게", "이탤릭체(기울임)", "밑줄", "빨간색"], c: 1, r: "추상 요소는 보통 이탤릭체로 표기합니다." },
    { type: 'choice', q: "Python에서 상수를 표기할 때 권장되는 방식은?", a: ["PascalCase", "camelCase", "UPPER_CASE", "snake_case"], c: 2, r: "상수는 대문자와 언더바를 사용합니다." },
    { type: 'choice', q: "C#이나 Java에서 에러를 던질 때 사용하는 키워드는?", a: ["raise", "throw", "emit", "send"], c: 1, r: "C#은 throw를 사용합니다." },
    { type: 'choice', q: "C언어에서 변수명, 함수명에 주로 사용하는 표기법은?", a: ["PascalCase", "camelCase", "snake_case", "kebab-case"], c: 2, r: "C언어는 snake_case를 관습적으로 씁니다." },
    { type: 'choice', q: "C#의 어셈블리 단위에 해당하는 파일 확장자는?", a: [".c / .h", ".py", ".exe / .dll", ".js"], c: 2, r: "어셈블리는 보통 .exe나 .dll 파일 단위입니다." },
    { type: 'choice', q: "클래스 내부 데이터 접근을 막고 메서드로만 허용하는 원칙은?", a: ["상속", "캡슐화", "다형성", "코드 재사용"], c: 1, r: "캡슐화입니다." },
    { type: 'choice', q: "Python 문자열의 첫 문자만 대문자로 만드는 메서드는?", a: ["upper", "capitalize", "title", "startcase"], c: 1, r: "capitalize()입니다." },
    { type: 'choice', q: "try 블록에서 오류가 발생했을 때만 실행되는 블록은?", a: ["try", "except / catch", "finally", "else"], c: 1, r: "except(Python) 또는 catch 블록입니다." },
    { type: 'choice', q: "코드 재사용, 모듈화, 가독성을 위한 코드 집합은?", a: ["변수", "제어문", "함수", "자료형"], c: 2, r: "함수(Function)의 정의입니다." },
    { type: 'choice', q: "Python 클래스에서 객체 생성 시 자동 호출되는 생성자는?", a: ["__init__", "__new__", "constructor", "start"], c: 0, r: "Python은 __init__을 생성자로 사용합니다." },
    { type: 'choice', q: "자료형이 결정할 수 있는 가장 중요한 요소는?", a: ["변수 이름", "메모리 크기", "실행 속도", "가독성"], c: 1, r: "자료형은 변수에 할당되는 메모리 크기를 결정합니다." },
    { type: 'choice', q: "프로세스 내에서 실행되는 흐름의 단위는?", a: ["프로세서", "스레드", "어셈블리", "인스턴스"], c: 1, r: "실행 흐름의 단위는 스레드(thread)입니다." },
    { type: 'choice', q: "모든 언어에서 클래스명에 공통으로 사용하는 표기법은?", a: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"], c: 1, r: "클래스명은 PascalCase가 표준입니다." },
    { type: 'choice', q: "Python nonlocal 키워드가 쓰이는 구조는?", a: ["전역 스코프", "중첩 함수", "클래스 메서드", "단일 함수"], c: 1, r: "중첩 함수 구조에서 외부 함수의 변수를 쓸 때 사용합니다." },
    { type: 'choice', q: "내부 스코프 변수가 외부의 같은 이름 변수를 가리는 현상은?", a: ["호이스팅", "클로저", "변수 섀도잉", "모듈화"], c: 2, r: "변수 섀도잉(Variable Shadowing)입니다." },

    // [단답형 50문제]
    { type: 'short', q: "데이터를 저장할 수 있는 메모리 공간을 무엇이라 하는가?", c: "변수", r: "변수(Variable)입니다." },
    { type: 'short', q: "자료형이 실행 시점에 결정되는 언어 방식을 무엇이라 하는가?", c: ["동적 타이핑", "동적타이핑"], r: "동적 타이핑(Dynamic Typing)입니다." },
    { type: 'short', q: "Python에서 if, else와 함께 쓰이는 'else if'용 키워드는?", c: "elif", r: "elif입니다." },
    { type: 'short', q: "함수에 전달되는 입력값을 무엇이라 하는가?", c: ["매개변수", "파라미터", "parameter"], r: "매개변수(Parameter)입니다." },
    { type: 'short', q: "함수가 실행 결과를 돌려줄 때 사용하는 키워드는?", c: "return", r: "return(반환)입니다." },
    { type: 'short', q: "객체를 생성하기 위한 템플릿이나 틀을 무엇이라 하는가?", c: "클래스", r: "클래스(Class)입니다." },
    { type: 'short', q: "첫 글자는 소문자, 중간 단어 첫 글자는 대문자인 표기법은?", c: "camelCase", r: "카멜 케이스입니다." },
    { type: 'short', q: "데이터와 메서드를 하나로 묶어 내부를 숨기는 원칙은?", c: "캡슐화", r: "캡슐화(Encapsulation)입니다." },
    { type: 'short', q: "기존 클래스의 특성을 물려받아 확장하는 원칙은?", c: "상속", r: "상속(Inheritance)입니다." },
    { type: 'short', q: "Python 변수 검색 규칙 4단계를 뜻하는 줄임말은?", c: "LEGB", r: "Local, Enclosing, Global, Built-in입니다." },
    { type: 'short', q: "C#에서 문자열을 숫자로 바꿀 때 null이면 에러를 내는 메서드는? (int.OOO)", c: ["parse", "Parse"], r: "int.Parse()입니다." },
    { type: 'short', q: "입력값에 상관없이 외부 상태를 바꾸지 않는 함수는?", c: ["순수 함수", "순수함수"], r: "순수 함수(Pure Function)입니다." },
    { type: 'short', q: "Python 중첩 함수에서 외부 함수 변수 수정 시 쓰는 키워드는?", c: "nonlocal", r: "nonlocal입니다." },
    { type: 'short', q: "C#에서 같은 프로젝트(어셈블리) 내에서만 접근을 허용하는 제한자는?", c: "internal", r: "internal입니다." },
    { type: 'short', q: "UML 표기법에서 public을 나타내는 기호는?", c: "+", r: "더하기(+) 기호입니다." },
    { type: 'short', q: "클래스가 반드시 구현해야 할 규약을 정의한 집합은?", c: "인터페이스", r: "인터페이스(Interface)입니다." },
    { type: 'short', q: "Python 리스트에서 원본 데이터를 직접 정렬하는 메서드는?", c: "sort", r: "data.sort()입니다." },
    { type: 'short', q: "프로세스 내에서 실제로 작업을 수행하는 실행 흐름의 단위는?", c: "스레드", r: "스레드(Thread)입니다." },
    { type: 'short', q: "모든 단어의 첫 글자를 대문자로 쓰는 표기법은?", c: "PascalCase", r: "파스칼 케이스입니다." },
    { type: 'short', q: "Python에서 예외를 강제로 발생시킬 때 사용하는 키워드는?", c: "raise", r: "raise입니다." },
    { type: 'short', q: "변수 선언 시 확보될 메모리 크기를 결정하는 요소는?", c: "자료형", r: "자료형(Type)입니다." },
    { type: 'short', q: "단어 사이에 언더바(_)를 사용하는 표기법 명칭은?", c: "snake_case", r: "스네이크 케이스입니다." },
    { type: 'short', q: "부모 클래스의 메서드를 자식에서 덮어쓰는 행위는?", c: "오버라이딩", r: "오버라이딩(Overriding)입니다." },
    { type: 'short', q: "UML 표기법에서 private을 나타내는 기호는?", c: ["-", "마이너스 "], r: "마이너스(-) 기호입니다." },
    { type: 'short', q: "함수 내부에서 자기 자신을 호출하는 방식은?", c: ["재귀", "재귀함수"], r: "재귀(Recursion)입니다." },
    { type: 'short', q: "Python 문자열의 첫 글자만 대문자로 바꾸는 메서드는?", c: "capitalize", r: "capitalize()입니다." },
    { type: 'short', q: "예외가 발생할 가능성이 있는 코드를 감싸는 블록 키워드는?", c: "try", r: "try 블록입니다." },
    { type: 'short', q: "예상치 못한 비정상적인 상황이나 실행 중 오류를 뜻하는 말은?", c: "예외", r: "예외(Exception)입니다." },
    { type: 'short', q: "정의된 곳 밖에서도 변수를 기억하는 Python의 특성은?", c: "클로저", r: "클로저(Closure)입니다." },
    { type: 'short', q: "Python에서 상수에 권장되는 표기 방식은? (영문 대문자)", c: "UPPER_CASE", r: "대문자와 언더바를 사용합니다." },
    { type: 'short', q: "UML에서 추상 요소를 나타낼 때 사용하는 글자 스타일은?", c: ["이탤릭", "이탤릭체"], r: "이탤릭체(기울임꼴)입니다." },
    { type: 'short', q: "데이터를 저장하는 공간에 붙이는 이름을 무엇이라 하는가?", c: "변수", r: "변수입니다." },
    { type: 'short', q: "반복적인 작업을 수행하기 위한 명령어 집합은?", c: "반복문", r: "반복문(Loop)입니다." },
    { type: 'short', q: "C#에서 null을 입력받으면 0을 반환해주는 변환 방식은?", c: "convert", r: "Convert.To 메서드입니다." },
    { type: 'short', q: "하나의 인터페이스가 여러 형태의 구현을 가지는 원칙은?", c: "다형성", r: "다형성(Polymorphism)입니다." },
    { type: 'short', q: "C언어에서 main 위에서 함수 정보를 미리 선언하는 것은?", c: "원형", r: "함수 원형(Prototype)입니다." },
    { type: 'short', q: "문자열이 특정 문자로 시작하는지 확인하는 메서드는?", c: "startswith", r: "startswith()입니다." },
    { type: 'short', q: "C# 인터페이스 이름 앞에 붙이는 약속된 알파벳은?", c: "I", r: "대문자 I입니다." },
    { type: 'short', q: "복잡함을 제거하고 핵심만 모델링하는 설계 방식은?", c: "추상화", r: "추상화(Abstraction)입니다." },
    { type: 'short', q: "함수 내에서 전역 변수를 쓰겠다고 선언하는 키워드는?", c: "global", r: "global입니다." },
    { type: 'short', q: "자신과 상속받은 자식 클래스만 접근 가능한 제한자는?", c: "protected", r: "protected입니다." },
    { type: 'short', q: "내부 스코프 변수가 외부 변수를 가리는 현상은?", c: "섀도잉", r: "변수 섀도잉입니다." },
    { type: 'short', q: "클래스명에 공통으로 쓰이는 첫 글자 대문자 표기법은?", c: "PascalCase", r: "파스칼 케이스입니다." },
    { type: 'short', q: "C#에서 예외가 발생했을 때 처리 코드를 담는 블록은?", c: "catch", r: "catch 블록입니다." },
    { type: 'short', q: "코드 재사용을 위해 입출력과 기능을 묶은 단위는?", c: "함수", r: "함수입니다." },
    { type: 'short', q: "원본 유지하며 정렬 결과를 반환하는 Python 함수는?", c: "sorted", r: "sorted()입니다." },
    { type: 'short', q: "함수명이나 변수명에 언더바를 쓰는 표기법 명칭은?", c: "snake_case", r: "스네이크 케이스입니다." },
    { type: 'short', q: "내부 데이터를 메서드로만 접근하게 제한하는 개념은?", c: "캡슐화", r: "캡슐화입니다." },
    { type: 'short', q: "문자열이 특정 문자로 끝나는지 확인하는 메서드는?", c: "endswith", r: "endswith()입니다." },
    { type: 'short', q: "C#에서 에러를 수동으로 발생시킬 때 쓰는 키워드는?", c: "throw", r: "throw입니다." }
];

// 초기 실행 방지 (이름 입력 전까지)
window.onload = () => {
    const progressElem = document.getElementById('progress');
    if(progressElem) progressElem.innerText = "이름을 입력해주세요.";
};

// 닉네임 입력 후 퀴즈 시작 함수
function startWithNickname() {
    const input = document.getElementById('user-name-input').value.trim();
    if (!input) {
        alert("이름을 입력해주세요!");
        return;
    }
    nickname = input;

    database.ref('users/' + nickname).once('value').then((snapshot) => {
        const data = snapshot.val();
        const overlay = document.getElementById('login-overlay');
        if(overlay) overlay.style.display = 'none';

        if (data && data.lastIndex < quizData.length) {
            if (confirm(`${nickname}님, 이전 기록이 있습니다. 이어 푸시겠습니까?`)) {
                currentIdx = data.lastIndex;
                score = data.totalScore;
            } else {
                database.ref('users/' + nickname).remove();
                currentIdx = 0;
                score = 0;
            }
        }
        loadQuestion();
    }).catch(error => {
        console.error("데이터 로드 오류:", error);
        loadQuestion();
    });
}

function loadQuestion() {
    const data = quizData[currentIdx];
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
            <input type="text" id="short-answer" placeholder="정답 입력 후 엔터 또는 제출" 
                   style="width:100%; padding:15px; border-radius:10px; border:2px solid #eee; font-size:1rem; box-sizing: border-box;">
            <button id="short-submit-btn" onclick="checkShortAnswer()" 
                    style="margin-top:10px; width:100%; padding:10px; background:#4a90e2; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;">제출하기</button>
        `;
        
        // 렌더링 후 포커스 및 이벤트 리스너 재등록
        setTimeout(() => {
            const inputField = document.getElementById('short-answer');
            if(inputField) {
                inputField.focus();
                inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !inputField.disabled) checkShortAnswer();
                });
            }
        }, 0);
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
    if (!input) return; // 요소가 없으면 종료

    const userAnswer = input.value.trim().toLowerCase().replace(/\s+/g, ''); 
    const dataC = quizData[currentIdx].c;
    
    // 정답 데이터를 무조건 배열 형태로 변환하여 처리
    const correctAnswers = Array.isArray(dataC) ? dataC : [dataC];
    
    // 입력값과 정답 배열 중 하나라도 일치하는지 확인
    const isCorrect = correctAnswers.some(ans => {
        const normalizedAns = String(ans).toLowerCase().replace(/\s+/g, '');
        return userAnswer === normalizedAns;
    });
    
    if (isCorrect) {
        score++;
        showFeedback(true);
    } else {
        showFeedback(false);
    }

    // 입력창 비활성화 (객관식 버튼 disable과 통일성)
    input.disabled = true;
    const submitBtn = input.nextElementSibling;
    if (submitBtn) submitBtn.disabled = true;
}

function showFeedback(isCorrect) {
    const data = quizData[currentIdx];
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        feedback.innerText = "✅ 정답입니다! \n" + data.r;
        feedback.className = "feedback correct";
    } else {
        const correctVal = data.type === 'choice'
        ? data.a[data.c]
        : (Array.isArray(data.c) ? data.c.join(", ") : data.c);
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
    if (!nickname) return;
    database.ref('users/' + nickname).set({
        lastIndex: currentIdx,
        totalScore: score,
        lastUpdated: Date.now()
    });
}

function disableOptions() {
    const btns = document.getElementsByClassName('option');
    for(let b of btns) b.disabled = true;
}

function showResult() {
    const container = document.getElementById('quiz-content');
    const grade = (score / quizData.length) * 100;
    saveProgress(); 

    container.innerHTML = `
        <div class="summary">
            <h2>학습 완료! 🎉</h2>
            <p style="font-size:1.2rem; color:#4a90e2;">${nickname}님 수고하셨습니다.</p>
            <p class="score-text">${score} / ${quizData.length} 정답</p>
            <p>정답률: ${Math.round(grade)}%</p>
            <button class="retry-btn" onclick="location.reload()">다른 이름으로 시작</button>
        </div>`;
}