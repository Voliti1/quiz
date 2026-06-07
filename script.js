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

// [1] 반도체 3대 원재료 풀 (3개 중 1개 선택)
const rawMaterialPool = [
    { 
        q: "반도체의 3대 원재료 중 하나에 대한 설명이다. 이 설명에 해당하는 재료명은?\n\n'반도체 물질로 만들어진 얇고 둥근 조각, 이 위에 집적회로를 만들어 넣게 된다. 현재 반도체 회사는 실리콘 기판을 주로 사용 하고 있으며, 직경 크기에 따라 4\", 5\", 6\", 8\", 12\"를 사용하고 있다.'", 
        a: ["웨이퍼 (Wafer)", "마스크 (Mask)", "리드 프레임 (Lead Frame)", "인쇄회로기판 (PCB)"], 
        c: 0, 
        r: "웨이퍼(Wafer)는 실리콘 등으로 만든 얇은 원판으로, 집적회로를 그 위에 그리는 반도체의 핵심 기판입니다." 
    },
    { 
        q: "반도체의 3대 원재료 중 하나에 대한 설명이다. 이 설명에 해당하는 재료명은?\n\n'이것 위에 만들어질 회로 패턴의 모양을 각 레이어 별로 유리판 위에 그려 놓은 것으로 Photo 공정시 Stepper(반도체 패턴 카메라)의 사진 건판으로 사용 된다.'", 
        a: ["웨이퍼 (Wafer)", "마스크 (Mask)", "리드 프레임 (Lead Frame)", "인쇄회로기판 (PCB)"], 
        c: 1, 
        r: "마스크(Mask)는 미세 회로 패턴이 유리판 위에 그려진 지판으로, 노광 공정 시 빛을 통과시키는 필터 역할을 합니다." 
    },
    { 
        q: "반도체의 3대 원재료 중 하나에 대한 설명이다. 이 설명에 해당하는 재료명은?\n\n'보통 구리로 만들어진 구조물로서, 조립공정 시 칩이 이 위에 놓여지게 되며 가는 금선 으로 칩과 연결된다. 이렇게 하여 IC칩이 외부와 전기 신호를 주고 받게 된다.'", 
        a: ["웨이퍼 (Wafer)", "마스크 (Mask)", "리드 프레임 (Lead Frame)", "인쇄회로기판 (PCB)"], 
        c: 2, 
        r: "리드 프레임(Lead Frame)은 반도체 패키지 내부에서 칩을 받치고 외부 단자들과 전기 신호를 연결해 주는 역할을 하는 구리 구조물입니다." 
    }
];

// [2] 반도체 클린룸 (방진복 순서 - 단일 유지, 순서들만 바꾼 보기)
const cleanroomPool = [
    { 
        q: "다음 중 올바른 방진복 착용 순서는 무엇인가?", 
        a: [
            "방진속장갑 - 방진마스크 - 모자 - 방진복 - 방진화 - 방진장갑",
            "방진마스크 - 방진속장갑 - 모자 - 방진복 - 방진화 - 방진장갑",
            "방진속장갑 - 모자 - 방진마스크 - 방진복 - 방진화 - 방진장갑",
            "방진속장갑 - 방진마스크 - 모자 - 방진화 - 방진복 - 방진장갑"
        ], 
        c: 0, 
        r: "방진복 착용 순서는 [방진속장갑 - 방진마스크 - 모자 - 방진복 - 방진화 - 방진장갑]이 올바릅니다." 
    }
];

// [3] 반도체 가스 풀 (6개 중 1개 선택)
const gasPool = [
    { 
        q: "반도체 가스 종류 중 하나에 대한 설명이다. 이 설명에 해당하는 가스군은?\n\n'가장 안전한 등급에 속하는 가스군으로 무색, 무취, 무미, 무 자극성 특징을 가지면 경고 특징이 없다. 유해성 (Hazards)으로는 고 압력으로 농축되어 있고, 저산소 농도(산소 19.5%)에 의한 질식성이 있으며 초저온상태이므로 주의해야 한다. 사용 예로는 Ar(아르곤), He(헬륨), N2(질소) 등이 있다.'", 
        a: ["불연성 가스", "가연성 가스", "독성 가스", "자연발화성 가스"], 
        c: 0, 
        r: "불연성 가스는 반응성이나 가연성이 없는 비교적 안전한 가스군으로 아르곤, 헬륨, 질소 등이 대표적입니다. 저산소 상태에 따른 질식 등에 주의해야 합니다." 
    },
    { 
        q: "반도체 가스 종류 중 하나에 대한 설명이다. 이 설명에 해당하는 가스군은?\n\n'폭발범위 하한이 10% 이하 이 거나 폭발 범위가 20% 이상인 가스로써 공기 중에 누설되면 부피가 확산되어 피해 범위가 크다. 이미 기화되어 있어 작은 점화원으로도 쉽게 인화, 폭발된다. 유해성 (Hazards)으로는 화재 및 폭발성으로 연소성이 매우 높고 고 압력으로 농축되어 있고, 저 산소 농도(산소 19.5%)에 의한 질식성이 있다. 사용 예로는 H2 (수소), C2H2 (아세틸렌), CH4 (메탄)등이 있다.'", 
        a: ["가연성 가스", "산화성 가스", "독성 가스", "부식성 가스"], 
        c: 0, 
        r: "가연성 가스는 아주 작은 스파크에도 쉽게 불이 붙어 화재 및 폭발을 유발하며 수소, 아세틸렌, 메탄 등이 있습니다." 
    },
    { 
        q: "반도체 가스 종류 중 하나에 대한 설명이다. 이 설명에 해당하는 가스군은?\n\n'연소를 촉진하거나 반응성을 증가시키는 가스로써 불난집에 부채질하는 가스로 볼수 있다. 유해성으로는 조연성으로 연소 및 반응성을 증가시키고 산소 과잉환경 조성하여 연소범위 넓어진다. 고 압력으로 주의해야 한다. 사용 예로는 O2(산소)와 “웃음가스”로 불리며 마취용으로 치과 의사들이 사용하는 N2O가 있다'", 
        a: ["가연성 가스", "산화성 가스", "부식성 가스", "자연발화성 가스"], 
        c: 1, 
        r: "산화성(조연성) 가스는 연소를 도와 반응을 격렬하게 증가시키는 가스로, 산소(O2)와 아산화질소(N2O, 웃음가스)가 있습니다." 
    },
    { 
        q: "반도체 가스 종류 중 하나에 대한 설명이다. 이 설명에 해당하는 가스군은?\n\n'성인남자가 1일 8시간 근무시 인체에 해를 끼치지 않는 허용농도(=TLV)가 200ppm 이하인 가스로써 흡입시 신체내의 신진대사를 방해하며 장기 손상을 준다. 대량 누출 시 생명에 영향을 주어 사망 또는 회복하기 어려운 피해를 받게된다. 유해성으로는 화재 및 폭발, 중독, 고 압력으로 주의를 가지고 관리해야 한다. 사용 예로는 CO, Cl2, F2, ClF3, BCl3, SiH4등이 있다.'", 
        a: ["불연성 가스", "산화성 가스", "독성 가스", "자연발화성 가스"], 
        c: 2, 
        r: "독성 가스는 허용 한계 농도가 200ppm 이하인 해로운 가스로서 신진대사를 방해하고 체내 장기에 치명적 손상을 줍니다." 
    },
    { 
        q: "반도체 가스 종류 중 하나에 대한 설명이다. 이 설명에 해당하는 가스군은?\n\n'다른 물질과 화학반응을 일으켜 물질 조직을 파괴 시키거나 금속등에 부식을 일으키는 가스로써 접촉시 피부조직을 파괴하며 일반적으로 습기와 접하기 전에는 이러한 성질을 가지고 있지 않다. 주요 사용 예는 Cl2, F2, ClF3, BCl3, BF3이 대표적이다.'", 
        a: ["가연성 가스", "독성 가스", "부식성 가스", "자연발화성 가스"], 
        c: 2, 
        r: "부식성 가스는 조직 파괴 및 금속 부식을 발생시키는 가스로서, 물이나 습기를 접하기 전에는 대개 건조한 상태에선 활성화되지 않는 특성이 있습니다." 
    },
    { 
        q: "반도체 가스 종류 중 하나에 대한 설명이다. 이 설명에 해당하는 가스군은?\n\n'공기중에 누설되면 별도의 점화원 없이 연소하는 가스로써 누출시 화재 및 폭발의 위험성이 높다. 가스의 농도와 유량에 영향을 받는다. 유해성으로는 화재 및 폭발을 유발하는 인화성과 고 압력을 주의 해야한다. 사용 예로는 SiH4(실란), AsH3(아르신), PH3(포스핀) 등이 있다.'", 
        a: ["산화성 가스", "독성 가스", "부식성 가스", "자연발화성 가스"], 
        c: 3, 
        r: "자연발화성 가스는 별도의 불씨(점화원)가 없어도 공기와 접촉하면 스스로 불이 붙어 누설 시 화재 위험이 높은 특수 가스로 SiH4, AsH3, PH3 등이 있습니다." 
    }
];

// [4] DI 시스템 풀 (4개 중 1개 선택)
const diPool = [
    { 
        q: "다음 설명에 해당하는 DI 시스템 장비는?\n\n'멤브레인을 통하여 액체에 포함되어 있는 오염물질을 제거하는 것. 이것은 0.1um~수십 um의 기공 크기를 가지며 낮은 압력에 의한 흐름으로부터 필터링 된다'", 
        a: ["마이크로 필터", "A/C 필터", "MBD (mixed bed deionizer)", "MBP (mixed bed polisher)"], 
        c: 0, 
        r: "마이크로 필터는 미세 여과막을 사용하여 액체 내 오염물질 및 미립자를 차단/필터링하는 수처리 장비입니다." 
    },
    { 
        q: "다음 설명에 해당하는 DI 시스템 장비는?\n\n'원수중에는 비이온성 용해물질이 함유되고 있다.. 이런 물질이 원수에 혼합되어 있으면 제거 처리하기가 어렵고, 수중의 냄새에 색상의 원인이 되고있는 유기물과 다른 비전해질 현탁물질을 흡착 제거하기 위해 흡착력이 뛰어난 활성탄을 이용한다.'", 
        a: ["마이크로 필터", "A/C 필터", "MBD (mixed bed deionizer)", "MBP (mixed bed polisher)"], 
        c: 1, 
        r: "A/C 필터는 활성탄(Activated Carbon)의 높은 흡착 성능을 통하여 냄새, 색상의 원인인 유기물을 흡착 여과합니다." 
    },
    { 
        q: "다음 설명에 해당하는 DI 시스템 장비는?\n\n'강산성 양이온 교환수지와 강염기성 음이온 교환수지를 단일탑에 혼합 충진시킨 후 원수중에 함유되어 있는 양이온과 음이온 성분을 완전히 제거하여 순수한 물을 교환 생성하는 장치이다. 또한 혼상식 순수제조장치는 원수가 통과하면서 양이온과 음이온을 여러번 통과시키는 효과를 가져오므로 고순도의 수질을 얻는데 적합하다. 일정용량을 생산한 후 가성 소다(NaOH)와 염산(HCI)으로 재생 반복 사용할 수 있다.'", 
        a: ["마이크로 필터", "A/C 필터", "MBD (mixed bed deionizer)", "MBP (mixed bed polisher)"], 
        c: 2, 
        r: "MBD는 양이온/음이온 수지를 활용해 불순물 이온을 고순도로 제거하며 가성소다와 염산으로 반복 화학 재생하여 사용하는 장치입니다." 
    },
    { 
        q: "다음 설명에 해당하는 DI 시스템 장비는?\n\n'이전 단계에서 처리된 초순수를 다시 한번 양이온과 음이온을 제거하는 공정으로서 내부에는 양이온과 음이온 교환수지가 혼합되어 있으며 순수한 H2O를 생산하며 수지의 재생이 불가능한 비재생형이다. 이 공정을 지나면 18MΩ-cm 이상의 고순도로 상승한다'", 
        a: ["마이크로 필터", "A/C 필터", "MBD (mixed bed deionizer)", "MBP (mixed bed polisher)"], 
        c: 3, 
        r: "MBP는 최종 한 번 더 잔류 양이온/음이온을 극소량까지 소거하여 18MΩ-cm 이상의 최고 수질 초순수로 격상시키는 비재생형 장치입니다." 
    }
];

// [5] 세정공정 풀 (4개 중 1개 선택)
const cleaningPool = [
    { 
        q: "다음 중 짝지어진 설명이 틀린 것은?", 
        a: ["SPM : 천이성 금속을 제거", "SC - 1 : 웨이퍼 위에 Particle과 유기 오염물을 제거", "SC - 2 : 천이성 금속을 제거", "HF : 산화물이나 산화물 내의 금속 오염물을 제거"], 
        c: 0, 
        r: "SPM은 웨이퍼 위의 PR 유기 오염물을 제거하는 화학 용액입니다. 천이성 금속을 제거하는 용액은 SC-2입니다." 
    },
    { 
        q: "다음 중 짝지어진 설명이 틀린 것은?", 
        a: ["SPM : 웨이퍼 위에 PR 유기 오염물을 제거", "SC - 1 : 산화물이나 산화물 내의 금속 오염물을 제거", "SC - 2 : 천이성 금속을 제거", "HF : 산화물이나 산화물 내의 금속 오염물을 제거"], 
        c: 1, 
        r: "SC-1은 웨이퍼 위의 Particle과 유기 오염물을 제거하는 화학 용액입니다. 산화물이나 산화물 내의 금속 오염물을 제거하는 용액은 HF입니다." 
    },
    { 
        q: "다음 중 짝지어진 설명이 틀린 것은?", 
        a: ["SPM : 웨이퍼 위에 PR 유기 오염물을 제거", "SC - 1 : 웨이퍼 위에 Particle과 유기 오염물을 제거", "SC - 2 : 웨이퍼 위에 PR 유기 오염물을 제거", "HF : 산화물이나 산화물 내의 금속 오염물을 제거"], 
        c: 2, 
        r: "SC-2는 천이성 금속을 제거하는 화학 용액입니다. 웨이퍼 위의 PR 유기 오염물을 제거하는 용액은 SPM입니다." 
    },
    { 
        q: "다음 중 짝지어진 설명이 틀린 것은?", 
        a: ["SPM : 웨이퍼 위에 PR 유기 오염물을 제거", "SC - 1 : 웨이퍼 위에 Particle과 유기 오염물을 제거", "SC - 2 : 천이성 금속을 제거", "HF : 천이성 금속을 제거"], 
        c: 3, 
        r: "HF는 산화물이나 산화물 내의 금속 오염물을 제거하는 화학 용액입니다. 천이성 금속을 제거하는 용액은 SC-2입니다." 
    }
];

// [6] 산화공정 풀 (3개 중 1개 선택 - 그림 문제)
const oxidationPool = [
    { 
        q: "이 그림에 해당 하는 산화물 용도로 맞는 것은?", 
        a: ["게이트 산화층 (Gate Oxide)", "절연층 / 소자간 격리 (Field Oxide / Isolation)", "마스크 (Mask)", "커패시터 (Capacitor)"], 
        c: 1, 
        r: "그림은 소자 활성 영역을 물리적 및 전기적으로 완전 고립 격리하는 필드 산화막(Field Oxide / Isolation)의 용도를 지시합니다.",
        img: "images/image6.png"
    },
    { 
        q: "이 그림에 해당 하는 산화물 용도로 맞는 것은?", 
        a: ["게이트 산화층 (Gate Oxide)", "절연층 / 소자간 격리 (Field Oxide / Isolation)", "마스크 (Mask)", "커패시터 (Capacitor)"], 
        c: 0, 
        r: "그림은 트랜지스터 게이트 전극 바로 아래 형성되어 전류 흐름 제어의 부도체 격벽이 되는 게이트 산화층(Gate Oxide)의 예시입니다.",
        img: "images/image4.png"
    },
    { 
        q: "이 그림에 해당 하는 산화물 용도로 맞는 것은?", 
        a: ["게이트 산화층 (Gate Oxide)", "절연층 / 소자간 격리 (Field Oxide / Isolation)", "마스크 (Mask)", "커패시터 (Capacitor)"], 
        c: 2, 
        r: "그림은 이온주입 차단벽(Dopant Barrier) 역할을 수행하여, 해당 산화막 아래층을 보호해주는 마스크(Mask) 기능의 산화층입니다.",
        img: "images/image9.png"
    }
];

// [7] Photo 공정 흐름 (단일 유지 - Exposure 빈칸 뚫기)
const photoPool = [
    { 
        q: "Photo 공정의 공정 흐름도에서 빈칸(실선으로 둘러싸인 빈 상자)에 들어갈 올바른 공정은?", 
        a: ["HMDS 코팅 (HMDS Coating)", "레지스트 코팅 (Resist Coating)", "노광 공정 (Exposure)", "현상 공정 (Development)"], 
        c: 2, 
        r: "초벌 굽기(Soft bake)와 노출 후 굽기(PEB) 사이의 빈칸 단계는 광을 조사하는 노광 공정(Exposure)입니다.",
        img: "images/image7_blanked.png"
    }
];

// [8] 노광 장비 풀 (3개 중 1개 선택 - docx 텍스트 그대로)
const exposureEquipPool = [
    { 
        q: "다음 설명에 해당하는 노광 장비는 무엇인가?\n\n'248nm∼436nm 파장의 빛을 레티클의 패턴에 조사시켜, 광학 렌즈를 이용 1:2.5, 1:5로 축소하여 패턴을 웨이퍼 위에 노광하는 장비'", 
        a: ["Stepper", "Scanner", "Aligner", "Track"], 
        c: 0, 
        r: "Stepper는 특정 레티클 상을 배율 렌즈로 축소 노광하며, 단계별로(Step-and-repeat) 웨이퍼 전체에 걸쳐 반사시키는 미세 가공 장비입니다." 
    },
    { 
        q: "다음 설명에 해당하는 노광 장비는 무엇인가?\n\n'노광장치에서 반도체 IC 내 미세패턴의 정확한구현을 위해 레티클의한쪽부터 빛을 조사해 나가는 장치.'", 
        a: ["Stepper", "Scanner", "Aligner", "Track"], 
        c: 1, 
        r: "Scanner는 레티클 전체에 빛을 한 번에 다 주는 대신, 위에서 아래로 주사(Scan)하면서 띠 형태로 정밀하게 패턴을 입히는 기계입니다." 
    },
    { 
        q: "다음 설명에 해당하는 노광 장비는 무엇인가?\n\n'간격을 일정간격으로 띄운 상태에서 노광하는 마스크와 감광막을 접촉시킨 상태에서 자외선을 조사시켜 노광하는 장비. 즉 마스크의 상이 1 : 1 비율로 투영하는 장비'", 
        a: ["Stepper", "Scanner", "Aligner", "Track"], 
        c: 2, 
        r: "Aligner는 원본 마스크와 감광 물질을 전면 밀착/근접시켜 1:1 실제 비율 그대로 균일 노출 노광시키는 가장 고전적이고 단순한 장비입니다." 
    }
];

// [9] 트랙 공정 풀 (3개 중 1개 선택)
const trackPool = [
    { 
        q: "트랙 공정 중 다음 설명에 해당하는 공정은 무엇인가?\n\n'감광막과 웨이퍼의 접착력 증대'", 
        a: ["HMDS coating", "PR coating", "EBR 공정", "현상 공정"], 
        c: 0, 
        r: "HMDS 코팅은 웨이퍼 표면을 수산화기(OH)에서 유기계 성질(소수성)로 바꾸어주어 수용성 성향의 PR 감광액 부착 성능을 비약적으로 올립니다." 
    },
    { 
        q: "트랙 공정 중 다음 설명에 해당하는 공정은 무엇인가?\n\n'액체 PR 등을 웨이퍼에 도포하기 위해서 회전을 사용하는 공정법, 품질 측정 요소 : 시간, 속도, 두께, 균일도, 미립자, 결함'", 
        a: ["HMDS coating", "PR coating", "EBR 공정", "현상 공정"], 
        c: 1, 
        r: "PR coating은 모터 고속 회전에 의한 원심력을 이용해 기판에 감광 물질의 얇고 매끄러운 단일 두께 막을 입히는 가공 방식입니다." 
    },
    { 
        q: "트랙 공정 중 다음 설명에 해당하는 공정은 무엇인가?\n\n'PR 코팅 과정에서 발생한 에지비드 제거, PR을 녹일 수 있는 솔벤트를 웨이퍼의 가장자리에 뿌리면서 회전'", 
        a: ["HMDS coating", "PR coating", "EBR 공정", "현상 공정"], 
        c: 2, 
        r: "EBR 공정은 회전 도포 과정 중 모서리에 과적되어 미립자 낙하 오염 등을 유발할 우려가 있는 에지비드 유기 막질을 분사 솔벤트로 녹여 씻는 작업입니다." 
    }
];

// [10] 습식 식각 풀 (3개 중 1개 선택)
const wetEtchPool = [
    { 
        q: "다음의 에칭 공정의 구분 중 틀린 것은?", 
        a: [
            "식각 방법에 따른 구분 : Wet etch (습식식각), Dry Etch (건식식각)",
            "식각 반응에 따른 구분 : Chemical Etch (화학적 식각), Physical Etch (물리적 식각)",
            "식각 형태에 따른 구분 : Isotropic Etch (등방성 식각), Anisotropic Etch (이방성 식각)",
            "식각 반응에 따른 구분 : Isotropic Etch (등방성 식각), Anisotropic Etch (이방성 식각)"
        ], 
        c: 3, 
        r: "식각 형태에 따른 구분이 Isotropic Etch(등방성)와 Anisotropic Etch(이방성)입니다. 식각 반응에 따른 구분은 Chemical Etch(화학적)와 Physical Etch(물리적)입니다." 
    },
    { 
        q: "다음의 에칭 공정의 구분 중 틀린 것은?", 
        a: [
            "식각 방법에 따른 구분 : Wet etch (습식식각), Dry Etch (건식식각)",
            "식각 반응에 따른 구분 : Chemical Etch (화학적 식각), Physical Etch (물리적 식각)",
            "식각 형태에 따른 구분 : Isotropic Etch (등방성 식각), Anisotropic Etch (이방성 식각)",
            "식각 방법에 따른 구분 : Chemical Etch (화학적 식각), Physical Etch (물리적 식각)"
        ], 
        c: 3, 
        r: "식각 반응에 따른 구분이 Chemical Etch(화학적)와 Physical Etch(물리적)입니다. 식각 방법에 따른 구분은 Wet Etch(습식)와 Dry Etch(건식)입니다." 
    },
    { 
        q: "다음의 에칭 공정의 구분 중 틀린 것은?", 
        a: [
            "식각 방법에 따른 구분 : Wet etch (습식식각), Dry Etch (건식식각)",
            "식각 반응에 따른 구분 : Chemical Etch (화학적 식각), Physical Etch (물리적 식각)",
            "식각 형태에 따른 구분 : Isotropic Etch (등방성 식각), Anisotropic Etch (이방성 식각)",
            "식각 형태에 따른 구분 : Wet etch (습식식각), Dry Etch (건식식각)"
        ], 
        c: 3, 
        r: "식각 방법에 따른 구분이 Wet Etch(습식)와 Dry Etch(건식)입니다. 식각 형태에 따른 구분은 Isotropic Etch(등방성)와 Anisotropic Etch(이방성)입니다." 
    }
];

// [11] 플라즈마 발생 원리 풀 (4개 중 1개 선택)
const plasmaPool = [
    { 
        q: "Dry Etch 플라즈마의 발생 원리 중 다음 설명에 해당하는 현상은?\n\n'외부에서 인가된 전계에 의해 전자가 가속되어 가스원자와 충돌, 원자핵에 구속되어 돌던 전자가 충돌에너지를 흡수하여 원자의 구속에서 벗어남'", 
        a: ["이온화 (Ionization)", "여기 (Excitation)", "분해, 재결합 (Dissociation, Recombination)", "에너지방출 (photoemission)"], 
        c: 0, 
        r: "이온화(Ionization)는 전자가 전기장에 의해 강하게 에너지를 얻고 원자와 격돌 시 원자의 궤도 전자를 핵 인력 밖으로 영구 격리 배출시켜 양이온을 얻는 작용입니다." 
    },
    { 
        q: "Dry Etch 플라즈마의 발생 원리 중 다음 설명에 해당하는 현상은?\n\n'전자들이 다시 가속되어 다른 원자와 충돌하여 제2차, 3차의 이온화 발생, 라디칼 발생'", 
        a: ["이온화 (Ionization)", "여기 (Excitation)", "분해, 재결합 (Dissociation, Recombination)", "에너지방출 (photoemission)"], 
        c: 1, 
        r: "여기(Excitation)는 전자 충돌 충격량이 이온을 형성할 만큼 세지는 않으나, 내부 전자를 높은 외곽 불안정 궤도 에너지 상태로 띄워 올리는 충격 현상입니다." 
    },
    { 
        q: "Dry Etch 플라즈마의 발생 원리 중 다음 설명에 해당하는 현상은?\n\n'가속된 전자가 가스원자와 충돌하였으나 에너지가 원자핵 구속을 벗어날 만큼 충분하지 못한 경우, 전자가 더 높은 에너지 상태의 다른 궤도로 여기, 라디칼 발생'", 
        a: ["이온화 (Ionization)", "여기 (Excitation)", "분해, 재결합 (Dissociation, Recombination)", "에너지방출 (photoemission)"], 
        c: 2, 
        r: "분해 및 재결합은 가스 결합 분자가 파괴되거나 활성도가 높아져 화학 에칭을 적극 주도하는 라디칼(Radical)을 형성하는 주요 경로입니다." 
    },
    { 
        q: "Dry Etch 플라즈마의 발생 원리 중 다음 설명에 해당하는 현상은?\n\n'높은 에너지 상태의 궤도로 여기된 전자가 원래의 궤도로 되돌아가면 그 에너지 차에 해당하는 만큼의 에너지 방출(열에너지 혹은 빛 에너지)'", 
        a: ["이온화 (Ionization)", "여기 (Excitation)", "분해, 재결합 (Dissociation, Recombination)", "에너지방출 (photoemission)"], 
        c: 3, 
        r: "energy 방출(Photoemission)은 궤도 이탈했던 전자가 본래의 안정한 바닥 상태로 하강 안착하며 여분 잔류의 열이나 고유한 가시광선 파장을 내뿜는 복사 소광 현상입니다." 
    }
];

// [12] 건식에칭장비 종류 풀 (3개 중 1개 선택)
const dryEtchEquipPool = [
    { 
        q: "건식에칭장비 중 다음 설명에 해당하는 장비는?\n\n'- 웨이퍼가 놓이는 전극에 RF 전압을 인가 \n- 공정압력을 낮게 유지 \n- Plasma 양이온이 plasma sheath를 통해 가속 \n- Planar 방식에 비해 이방 성 식각 특성을 향상시킨 구조 \n- 낮은 플라즈마 밀도'", 
        a: ["RIE (Reactive Ion Etching)", "TCP (Transformer Coupled Plasma)", "ICP (Inductively Coupled Plasma)", "CVD"], 
        c: 0, 
        r: "RIE는 하판 전극에 RF 신호를 인가하고, 시스(sheath) 전기장으로 고속의 반응성 이온을 전극 수직 방향으로 가속 격돌시켜 이방성 성향을 극대화하는 표준 건식 가공 장비입니다." 
    },
    { 
        q: "건식에칭장비 중 다음 설명에 해당하는 장비는?\n\n'- 챔버 상부에 원형으로 코일 설치\n- RF 파워 인가\n- 코일을 흐르는 전류에 의해 플라즈마 내에도 inductance 성분유기 \n- 플레밍의 왼손법칙에 따라서 수직방향의 자계, 수평방향의 전계가 형성 \n- Skin depth 내에 형성된 전계 를 따라 전자가 회전운동 → 가속'", 
        a: ["RIE (Reactive Ion Etching)", "TCP (Transformer Coupled Plasma)", "ICP (Inductively Coupled Plasma)", "CVD"], 
        c: 1, 
        r: "TCP는 챔버 천장 외곽에 평평한 환형 코일을 올리고 강한 RF 전류를 흘려, 유도 전자기장과 플레밍 법칙에 따른 자력으로 고속 가속을 실현하는 고밀도 플라즈마 에처입니다." 
    },
    { 
        q: "건식에칭장비 중 다음 설명에 해당하는 장비는?\n\n'- 챔버 측면에 코일\n- 13.56MHz의 RF 파워인가\n- 고밀도 plasma 형성 → 식각속도 우수\n- 챔버구조가 간단 \n- 플라즈마가 넓고 이온을 가속시키지 않음 → 이온 충격에 의한 손상이 없음'", 
        a: ["RIE (Reactive Ion Etching)", "TCP (Transformer Coupled Plasma)", "ICP (Inductively Coupled Plasma)", "CVD"], 
        c: 2, 
        r: "ICP는 원통형 측벽 바깥에 유도 결합 코일을 두르고 교류 방전시켜 아주 짙은 가스를 제조하여 깎는 속도가 뛰어나며, 전하 충돌 기판 흠집을 줄여주는 장비입니다." 
    }
];

// [13] 확산 공정 풀 (2개 중 1개 선택 - 그림 구분 문제)
const diffImplantPool = [
    { 
        q: "아래 그림은 확산(Diffusion) 공정과 이온 주입(Ion Implantation) 공정의 차이를 설명하는 그림 중 하나이다. 이 그림이 나타내는 공정은 무엇인가?", 
        a: ["확산 공정 (Diffusion)", "이온 주입 공정 (Ion Implantation)", "산화 공정 (Oxidation)", "금속 배선 공정 (Metallization)"], 
        c: 0, 
        r: "그림은 기화된 불순물 기체(GAS of Dopant Atoms)를 웨이퍼 위에 공급하고, 뜨거운 로 내 열로 표면 기판 깊숙이 등방성 방향으로 스며들게 하는 확산 공정입니다.",
        img: "images/image5.png"
    },
    { 
        q: "아래 그림은 확산(Diffusion) 공정과 이온 주입(Ion Implantation) 공정의 차이를 설명하는 그림 중 하나이다. 이 그림이 나타내는 공정은 무엇인가?", 
        a: ["확산 공정 (Diffusion)", "이온 주입 공정 (Ion Implantation)", "산화 공정 (Oxidation)", "금속 배선 공정 (Metallization)"], 
        c: 1, 
        r: "그림은 기체 원자를 강제 이온화 후 강한 방향성의 높은 에너지를 가진 이온 빔(High velocity Dopant Ion)으로 가속해 표면에 때려박아 주는 이온주입공정의 모식도입니다.",
        img: "images/image2.png"
    }
];

// [14] 열처리 공정 (단일 유지 - RTA 문제)
const rtaPool = [
    { 
        q: "열처리 공정의 RTA(Rapid Thermal Annealing)에 대한 설명 중 틀린 것은?", 
        a: [
            "도핑공정 이후 결정 격자의 손상(damage)을 제거하기 위해 수행한다.",
            "Furnace annealing에 비해 더 높은 온도(1100-1150 °C)에서 아주 짧은 시간(30초) 동안 진행된다.",
            "고온의 열을 빠르게 전달하고 빠져나가기 때문에 웨이퍼 온도를 측정하고 정밀하게 컨트롤하는 것이 핵심이다.",
            "Furnace annealing과 동일하게 850-1000 °C의 온도에서 약 30분간 서서히 진행하는 열처리 방식이다."
        ], 
        c: 3, 
        r: "RTA는 퍼니스 어닐링에 비해 훨씬 높은 온도에서 30초 정도의 짧은 시간 동안 빠르게 열을 가해 손상을 복구하는 급속 열처리 기법입니다. 30분 동안 가열하는 것은 전통적인 Furnace annealing의 특징입니다." 
    }
];

// [15] 증착 공정 (단일 유지 - CVD 분류 기준 문제)
const cvdPool = [
    { 
        q: "증착공정 중 CVD(화학 기상 증착) 장비의 종류인 APCVD와 LPCVD는 주로 어떤 물리적 조건의 차이에 따라서 구분한 것인가?", 
        a: ["챔버 내 압력 (Pressure)", "공정 진행 시간 (Time)", "플라즈마 주파수 (Frequency)", "웨이퍼 직경 (Diameter)"], 
        c: 0, 
        r: "APCVD는 챔버 내 기압이 대기압(상압)인 상태에서 진행하며, LPCVD는 감압(저압) 상태에서 증착을 수행합니다. 분류 기준은 주로 '챔버 내 압력'입니다." 
    }
];

// [16] 금속 공정 (단일 유지 - Sputtering 현상 문제)
const sputteringPool = [
    { 
        q: "반도체 금속 배선 공정 중 다음에 설명된 현상 및 공정 방식은 무엇인가?\n\n'플라즈마를 발생시켜 Ar 이온이 음극인 타겟(Target)으로 가속되어 충돌하고, 충돌에 의한 운동 에너지가 타겟 원자에 전달되어 표면 원자가 이탈하여 기판에 박막 형태로 부착되는 물리적 증착 공정'", 
        a: ["화학 기상 증착 (CVD)", "원자층 증착 (ALD)", "스퍼터링 (Sputtering)", "진공 증착 (Evaporation)"], 
        c: 2, 
        r: "설명된 방식은 Ar 플라즈마 에너지를 활용해 음극 타겟의 표면 금속 원자들을 물리적으로 뜯어 기판에 입히는 물리적 기상 증착(PVD)인 스퍼터링(Sputtering)입니다." 
    }
];

function toQuiz() {
    nickname = document.getElementById('user-name-input').value.trim();
    if(!nickname) { alert("이름을 입력해주세요!"); return; }
    
    // 각 16개 카테고리 풀에서 문제 1개씩 무작위 선택
    const selectedQuestions = [
        rawMaterialPool[Math.floor(Math.random() * rawMaterialPool.length)],
        cleanroomPool[Math.floor(Math.random() * cleanroomPool.length)],
        gasPool[Math.floor(Math.random() * gasPool.length)],
        diPool[Math.floor(Math.random() * diPool.length)],
        cleaningPool[Math.floor(Math.random() * cleaningPool.length)],
        oxidationPool[Math.floor(Math.random() * oxidationPool.length)],
        photoPool[Math.floor(Math.random() * photoPool.length)],
        exposureEquipPool[Math.floor(Math.random() * exposureEquipPool.length)],
        trackPool[Math.floor(Math.random() * trackPool.length)],
        wetEtchPool[Math.floor(Math.random() * wetEtchPool.length)],
        plasmaPool[Math.floor(Math.random() * plasmaPool.length)],
        dryEtchEquipPool[Math.floor(Math.random() * dryEtchEquipPool.length)],
        diffImplantPool[Math.floor(Math.random() * diffImplantPool.length)],
        rtaPool[Math.floor(Math.random() * rtaPool.length)],
        cvdPool[Math.floor(Math.random() * cvdPool.length)],
        sputteringPool[Math.floor(Math.random() * sputteringPool.length)]
    ];

    // 선택된 16문항을 랜덤하게 섞음
    currentQuizSet = selectedQuestions.sort(() => Math.random() - 0.5);
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

    // 답변 순서의 랜덤성 추가
    const originalOptions = data.a;
    const correctText = originalOptions[data.c];
    
    // 보기들을 섞어서 새로운 키 설정
    data.shuffledA = [...originalOptions].sort(() => Math.random() - 0.5);
    data.shuffledC = data.shuffledA.indexOf(correctText);

    data.shuffledA.forEach((txt, i) => {
        const b = document.createElement('button');
        b.className = 'option';
        b.innerText = txt;
        b.onclick = () => checkChoice(i);
        optCont.appendChild(b);
    });
}

function checkChoice(idx) {
    if(document.getElementById('next-btn').style.display === 'block') return;
    const data = currentQuizSet[currentIdx];
    const correct = data.shuffledC;
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
        fb.innerText = `❌ 틀렸습니다. (정답: ${data.shuffledA[data.shuffledC]})\n\n` + data.r;
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
