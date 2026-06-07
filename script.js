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

let nickname = "";
const selectedCount = 16;
let currentQuizSet = [];
let currentIdx = 0;
let score = 0;

// [데이터] 반도체 제조공정 퀴즈 16문항
const choiceData = [
    { 
        q: "반도체의 3대 원재료 중 하나에 대한 설명이다. 이 설명에 해당하는 재료명은?\n\n\"보통 구리로 만들어진 구조물로서, 조립공정 시 칩이 이 위에 놓여지게 되며 가는 금선으로 칩과 연결된다. 이렇게 하여 IC칩이 외부와 전기 신호를 주고받게 된다.\"", 
        a: ["웨이퍼 (Wafer)", "마스크 (Mask)", "리드 프레임 (Lead Frame)", "인쇄회로기판 (PCB)"], 
        c: 2, 
        r: "리드 프레임은 조립공정 시 칩을 올려놓고 가느다란 금선으로 연결하여 외부와의 전기 신호 통로 역할을 하도록 구리로 만든 얇은 판 모양의 구조물입니다." 
    },
    { 
        q: "다음 중 방진복 착용 순서에 대한 설명으로 틀린 것은?", 
        a: [
            "방진속장갑을 낀 후에 방진마스크를 착용한다.",
            "모자를 쓰기 전에 방진마스크를 착용한다.",
            "방진복을 입기 전에 방진화를 먼저 착용한다.",
            "방진화를 착용한 후에 방진장갑을 착용한다."
        ], 
        c: 2, 
        r: "올바른 착용 순서는 [방진속장갑 - 방진마스크 - 모자 - 방진복 - 방진화 - 방진장갑]입니다. 방진복을 먼저 입고 나서 방진화를 착용해야 하므로, 방진복을 입기 전에 방진화를 신는다는 것은 틀린 설명입니다." 
    },
    { 
        q: "다음 반도체 공정 가스에 대한 설명을 읽고, 이 설명은 어떤 가스를 말하는 것인가?\n\n\"공기중에 누설되면 별도의 점화원 없이 연소하는 가스로써 누출시 화재 및 폭발의 위험성이 높다. 가스의 농도와 유량에 영향을 받으며, 사용 예로는 SiH4(실란), AsH3(아르신), PH3(포스핀) 등이 있다.\"", 
        a: ["가연성 가스", "산화성 가스", "독성 가스", "자연발화성 가스"], 
        c: 3, 
        r: "별도의 스파크나 불꽃(점화원) 없이 공기 중에 새어나오기만 해도 스스로 타오르는 성질을 갖는 가스는 자연발화성 가스입니다. 대표적으로 SiH4, AsH3, PH3 등이 있습니다." 
    },
    { 
        q: "다음 설명에 해당하는 DI(Deionized Water) 시스템 장비는 무엇인가?\n\n\"MBD에서 처리된 초순수를 다시 한번 양이온과 음이온을 제거하는 공정으로서 내부에는 양이온과 음이온 교환수지가 혼합되어 있으며 순수한 H2O를 생산하며 수지의 재생이 불가능한 비재생형이다. 이 공정을 지나면 18MΩ-cm 이상의 고순도로 상승한다.\"", 
        a: ["마이크로 필터 (Micro Filter)", "A/C 필터 (Active Carbon Filter)", "MBD (Mixed Bed Deionizer)", "MBP (Mixed Bed Polisher)"], 
        c: 3, 
        r: "MBP(Mixed Bed Polisher)는 재생 공정이 불가능한 교환 수지를 포함하며, 최종 단계에서 초순수의 수질을 18MΩ-cm 이상의 최고 순도로 극대화하는 비재생형 장치입니다." 
    },
    { 
        q: "세정공정 화학 용액(Chemical)과 그 역할에 대한 설명 중, 짝지어진 설명이 틀린 것은?", 
        a: [
            "SPM : 웨이퍼 위의 PR 유기 오염물을 제거",
            "SC - 1 : 천이성 금속을 제거",
            "SC - 2 : 천이성 금속을 제거",
            "HF : 산화물이나 산화물 내의 금속 오염물을 제거"
        ], 
        c: 1, 
        r: "SC-1 용액은 암모니아와 과산화수소 혼합액으로, 주로 웨이퍼 상의 입자(Particle)와 유기 오염물을 제거하기 위해 사용됩니다. 천이성 금속을 제거하는 화학 물질은 염산과 과산화수소를 결합한 SC-2입니다." 
    },
    { 
        q: "산화공정에서 아래 그림의 화살표가 가리키는 산화물 용도로 맞는 것은?", 
        a: ["게이트 산화층 (Gate Oxide)", "절연층 / 소자간 격리 (Field Oxide / Isolation)", "마스크 (Mask)", "커패시터 (Capacitor)"], 
        c: 1, 
        r: "그림은 필드 산화막(Field Oxide Layer)을 보여주고 있습니다. 필드 산화물은 소자 간의 물리적 및 전기적 절연을 위한 격리층(Isolation) 역할을 수행합니다.",
        img: "images/image6.png"
    },
    { 
        q: "Photo 공정의 공정 흐름도에서 빈칸(실선으로 둘러싸인 빈 상자)에 들어갈 올바른 공정은?", 
        a: ["HMDS 코팅 (HMDS Coating)", "레지스트 코팅 (Resist Coating)", "노광 공정 (Exposure)", "현상 공정 (Development)"], 
        c: 2, 
        r: "초벌 굽기(Soft bake)와 노출 후 굽기(PEB) 사이의 단계로, 마스크 패턴을 정렬하여 자외선 등의 빛을 감광막에 조사하는 공정은 노광 공정(Exposure)입니다.",
        img: "images/image7_blanked.png"
    },
    { 
        q: "노광 장비인 Stepper, Scanner, Aligner에 대한 설명 중, 설명과 이름이 맞지 않는 것은?", 
        a: [
            "Stepper : 248nm∼436nm 파장의 빛을 축소 렌즈를 통해 웨이퍼에 축소 노광하는 장비",
            "Scanner : 마스크와 감광막을 접촉시킨 상태에서 자외선을 조사하여 1:1 비율로 노광하는 장비",
            "Aligner : 간격을 띄우거나 마스크와 감광막을 접촉시킨 상태에서 자외선을 조사하여 1:1 비율로 투영 노광하는 장비",
            "Scanner : 반도체 IC 내 미세패턴의 정확한 구현을 위해 레티클의 한쪽부터 빛을 조사해 나가는 장비"
        ], 
        c: 1, 
        r: "마스크와 웨이퍼 감광막을 근접 또는 접촉시킨 상태에서 1:1 크기로 통째로 노광시키는 장비는 Aligner입니다. Scanner는 패턴이 미세화됨에 따라 레티클 일부 영역에 스캔용 빛을 쏘아 주사하듯이 노광해 나가는 장비입니다." 
    },
    { 
        q: "트랙 공정 중 다음 설명에 해당하는 공정은 무엇인가?\n\n\"PR 코팅 과정에서 발생한 에지비드를 제거하기 위해, PR을 녹일 수 있는 솔벤트를 웨이퍼의 가장자리에 뿌리면서 회전시키는 공정\"", 
        a: ["HMDS 코팅 (HMDS Coating)", "PR 코팅 (PR Coating)", "에지비드 제거 공정 (EBR)", "현상 공정 (Development)"], 
        c: 2, 
        r: "웨이퍼 고속 회전으로 감광액 코팅 시 원심력 때문에 웨이퍼 가장자리 끝부분에 PR이 두껍게 뭉치는 현상(Edge Bead)이 발생합니다. 이를 지워내기 위해 솔벤트를 분사하며 정제하는 것을 EBR(Edge Bead Removal) 공정이라고 합니다." 
    },
    { 
        q: "에칭 공정의 구분 기준과 매칭이 올바르지 않은 것은?", 
        a: [
            "식각 방법에 따른 구분 : 습식식각(Wet etch), 건식식각(Dry etch)",
            "식각 반응에 따른 구분 : 화학적 식각(Chemical etch), 물리적 식각(Physical etch)",
            "식각 형태에 따른 구분 : 등방성 식각(Isotropic etch), 이방성 식각(Anisotropic etch)",
            "식각 장비에 따른 구분 : 고온 식각(Hot etch), 저온 식각(Cold etch)"
        ], 
        c: 3, 
        r: "에칭 공정의 주요 구분 방법에는 식각 방식(물 사용 유무에 따른 습식/건식), 식각을 일으키는 작용 원리(물리적/화학적), 식각이 깎여나가는 방향성(사방으로 깎이는 등방성/수직으로 깎이는 이방성) 세 가지가 대표적이며 장비 온도에 따른 명확한 이분법 분류는 없습니다." 
    },
    { 
        q: "Dry Etch 플라즈마의 발생 원리 중 다음 설명에 해당하는 현상은?\n\n\"외부에서 인가된 전계에 의해 전자가 가속되어 가스원자와 충돌하고, 원자핵에 구속되어 돌던 전자가 충돌에너지를 흡수하여 원자의 구속에서 벗어나는 현상\"", 
        a: ["이온화 (Ionization)", "여기 (Excitation)", "분해 및 재결합 (Dissociation, Recombination)", "에너지 방출 (Photoemission)"], 
        c: 0, 
        r: "외부 전기장으로 가속된 전자와 기체 원자가 부딪쳐, 원자에 묶여 있던 전자가 떨어져 나가 이온과 전자로 분리되는 현상을 이온화(Ionization)라고 합니다." 
    },
    { 
        q: "건식에칭장비(RIE, TCP, ICP)의 종류와 특징에 대한 설명으로 틀린 것은?", 
        a: [
            "RIE는 웨이퍼가 놓이는 전극에 RF 전압을 인가하며, 플라즈마 밀도가 낮은 편이다.",
            "ICP는 챔버 측면에 코일을 설치하고 13.56MHz RF 파워를 가해 고밀도 플라즈마를 형성한다.",
            "ICP는 플라즈마가 넓고 이온을 가속시키지 않아 이온 충격에 의한 기판 손상이 없다.",
            "RIE는 챔버 상부에 코일을 설치하고 플레밍의 왼손법칙을 사용하여 수직 자계를 형성하는 대표적인 고밀도 플라즈마 장비이다."
        ], 
        c: 3, 
        r: "챔버 상부에 평평하게 코일을 배치하고 고주파 전류를 공급하여, 전자기 유도를 일으키고 자계와 전계를 조합시켜 고밀도 플라즈마를 형성하는 기법은 TCP(Transformer Coupled Plasma) 장비의 설명입니다. RIE는 전극판에 직접 RF 에너지를 걸어주는 평행판 방식입니다." 
    },
    { 
        q: "아래 그림은 확산(Diffusion) 공정과 이온 주입(Ion Implantation) 공정의 차이를 설명하는 그림 중 하나이다. 이 그림이 나타내는 공정은 무엇인가?", 
        a: ["확산 공정 (Diffusion)", "이온 주입 공정 (Ion Implantation)", "산화 공정 (Oxidation)", "금속 배선 공정 (Metallization)"], 
        c: 0, 
        r: "그림은 마스크가 뚫린 사이로 가스 상태의 도펀트 원자(GAS of Dopant Atoms)가 공급되어 열처리를 받으며 고온에 의해 실리콘 기판 내부로 서서히 번져 들어가는 '확산 공정(Diffusion)'을 표현하고 있습니다.",
        img: "images/image5.png"
    },
    { 
        q: "열처리 공정의 RTA(Rapid Thermal Annealing)에 대한 설명 중 틀린 것은?", 
        a: [
            "도핑공정 이후 결정 격자의 손상(damage)을 제거하기 위해 수행한다.",
            "Furnace annealing에 비해 더 높은 온도(1100-1150 °C)에서 아주 짧은 시간(30초) 동안 진행된다.",
            "고온의 열을 빠르게 전달하고 빠져나가기 때문에 웨이퍼 온도를 측정하고 정밀하게 컨트롤하는 것이 핵심이다.",
            "Furnace annealing과 동일하게 850-1000 °C의 온도에서 약 30분간 서서히 진행하는 열처리 방식이다."
        ], 
        c: 3, 
        r: "RTA(급속 열처리)는 1100~1150 °C 급의 높은 온도에서 30초 내외의 지극히 짧은 시간에 웨이퍼를 열처리하여 불순물 프로파일 변화를 억제하고 격자 손상을 복구합니다. 850~1000 °C에서 30분간 굽는 방식은 전통적인 퍼니스 어닐링(Furnace Annealing)에 해당합니다." 
    },
    { 
        q: "증착공정 중 CVD(화학 기상 증착) 장비의 종류인 APCVD와 LPCVD는 주로 어떤 물리적 조건의 차이에 따라서 구분한 것인가?", 
        a: ["챔버 내 압력 (Pressure)", "공정 진행 시간 (Time)", "플라즈마 주파수 (Frequency)", "웨이퍼 직경 (Diameter)"], 
        c: 0, 
        r: "APCVD는 Atmospheric Pressure CVD(상압 화학 기상 증착)로 대기압(760 Torr) 상태에서, LPCVD는 Low Pressure CVD(감압/저압 화학 기상 증착)로 진공에 가까운 10 Torr 이하의 저압 조건에서 박막 증착이 진행됩니다. 따라서 이들은 '압력'의 차이로 나뉩니다." 
    },
    { 
        q: "반도체 금속 배선 공정 중 다음에 설명된 현상 및 공정 방식은 무엇인가?\n\n\"플라즈마를 발생시켜 Ar 이온이 음극인 타겟(Target)으로 가속되어 충돌하고, 충돌에 의한 운동 에너지가 타겟 원자에 전달되어 표면 원자가 이탈하여 기판에 박막 형태로 부착되는 물리적 증착 공정\"", 
        a: ["화학 기상 증착 (CVD)", "원자층 증착 (ALD)", "스퍼터링 (Sputtering)", "진공 증착 (Evaporation)"], 
        c: 2, 
        r: "아르곤(Ar) 이온을 금속 표적(타겟)에 강하게 부딪혀, 운동 에너지 전달로 타겟 원자들을 강제 이탈(튀어 나오게)시킨 후 기판에 막질을 올리는 물리적 기상 증착(PVD) 방식은 스퍼터링(Sputtering)입니다." 
    }
];

function toQuiz() {
    nickname = document.getElementById('user-name-input').value.trim();
    if(!nickname) { alert("이름을 적어주세요!"); return; }
    
    // 문제 랜덤 섞기
    currentQuizSet = [...choiceData].sort(() => Math.random() - 0.5);
    currentIdx = 0;
    score = 0;

    document.getElementById('step-name').classList.remove('active');
    document.getElementById('step-quiz').classList.add('active');
    loadQuestion();
}

function loadQuestion() {
    const data = currentQuizSet[currentIdx];
    document.getElementById('progress').innerText = `문제 ${currentIdx + 1} / ${selectedCount}`;
    document.getElementById('question').innerText = data.q;
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    // 이미지 엘리먼트 표시 여부
    const imgEl = document.getElementById('quiz-image');
    if (data.img) {
        imgEl.src = data.img;
        imgEl.style.display = 'block';
    } else {
        imgEl.style.display = 'none';
    }

    const optCont = document.getElementById('quiz-options');
    optCont.innerHTML = '';

    data.a.forEach((txt, i) => {
        const b = document.createElement('button');
        b.className = 'option';
        b.innerText = txt;
        b.onclick = () => checkChoice(i);
        optCont.appendChild(b);
    });
}

function checkChoice(idx) {
    if(document.getElementById('next-btn').style.display === 'block') return;
    const correct = currentQuizSet[currentIdx].c;
    const isCorrect = (idx === correct);
    if(isCorrect) score++;
    
    // 버튼 스타일 업데이트
    const buttons = document.querySelectorAll('.option');
    buttons.forEach((btn, i) => {
        btn.disabled = true; // 중복 선택 방지
        if (i === correct) {
            btn.style.borderColor = '#48bb78';
            btn.style.background = '#f0fff4';
            btn.style.color = '#22543d';
            btn.style.fontWeight = 'bold';
        } else if (i === idx) {
            btn.style.borderColor = '#f56565';
            btn.style.background = '#fff5f5';
            btn.style.color = '#742a2a';
        }
    });

    showFeedback(isCorrect);
}

function showFeedback(isCorrect) {
    const fb = document.getElementById('feedback');
    const data = currentQuizSet[currentIdx];
    fb.style.display = 'block';
    if(isCorrect) {
        fb.className = "feedback correct";
        fb.innerText = "✅ 정답입니다!\n\n" + data.r;
    } else {
        fb.className = "feedback wrong";
        fb.innerText = `❌ 틀렸습니다. (정답: ${data.a[data.c]})\n\n` + data.r;
    }
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentIdx++;
    if(currentIdx < selectedCount) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    const cont = document.getElementById('quiz-container');
    database.ref('results/' + nickname).push({ score, total: selectedCount, date: new Date().toLocaleString() });
    
    cont.innerHTML = `
        <div class="view-step active">
            <h2>테스트 종료!</h2>
            <p>${nickname}님의 점수</p>
            <h1 style="color:var(--primary); font-size:3rem; margin: 20px 0;">${score} / ${selectedCount}</h1>
            <button class="main-btn" onclick="location.reload()">다시 시작</button>
        </div>
    `;
}