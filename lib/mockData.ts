import type { Article, Topic, WordEntry } from "./types";
import { defaultLocale, getDict, type Locale } from "./i18n";

export const topics: Topic[] = [
  {
    id: "school-life",
    title: { zh: "校园生活", en: "School Life" },
    description: {
      zh: "莉莉在新学校的第一天：新老师、新教室、新朋友。",
      en: "Lily's first day at school — new teacher, new classroom, new friends.",
    },
    emoji: "🏫",
    level: "Beginner",
    articleId: "first-day",
  },
  {
    id: "animals",
    title: { zh: "动物与自然", en: "Animals & Nature" },
    description: {
      zh: "大象的长鼻子里藏着什么秘密？",
      en: "What's special about an elephant's long nose?",
    },
    emoji: "🐘",
    level: "Beginner",
    articleId: "elephant-nose",
  },
  {
    id: "science",
    title: { zh: "科学启蒙", en: "Science for Kids" },
    description: {
      zh: "为什么我们会有春夏秋冬四个季节？",
      en: "Why do we have spring, summer, autumn, and winter?",
    },
    emoji: "🌍",
    level: "Intermediate",
    articleId: "why-seasons",
  },
  {
    id: "health",
    title: { zh: "运动与健康", en: "Sports & Health" },
    description: {
      zh: "爷爷用几个简单的小习惯过着健康的一天。",
      en: "Grandpa stays healthy with a few simple daily habits.",
    },
    emoji: "🍎",
    level: "Beginner",
    articleId: "healthy-day",
  },
  {
    id: "festivals",
    title: { zh: "节日文化", en: "Festivals" },
    description: {
      zh: "我最喜欢的节日：春节。",
      en: "My favorite festival: Chinese New Year.",
    },
    emoji: "🎉",
    level: "Beginner",
    articleId: "favorite-festival",
  },
  {
    id: "famous-people",
    title: { zh: "名人故事", en: "Famous People" },
    description: {
      zh: "奥林匹克运动会的故事——从古希腊到今天。",
      en: "The Olympic Games — from ancient Greece to today.",
    },
    emoji: "🏅",
    level: "Intermediate",
    articleId: "olympic-games",
  },
  {
    id: "young-inventor",
    title: { zh: "科技入门 · 小小发明家", en: "Technology · Young Inventor" },
    description: {
      zh: "12 岁的汤姆为奶奶做了一个不会倒的杯子。",
      en: "12-year-old Tom builds a cup that won't tip over for his grandma.",
    },
    emoji: "💡",
    level: "Beginner",
    articleId: "young-inventor",
  },
  {
    id: "robots",
    title: { zh: "科技入门 · 机器人帮帮忙", en: "Technology · Helpful Robots" },
    description: {
      zh: "机器人在工厂、医院和家里都能帮上人类的忙。",
      en: "How robots help people in factories, hospitals, and at home.",
    },
    emoji: "🤖",
    level: "Intermediate",
    articleId: "robots-help",
  },
];

export const articles: Article[] = [
  {
    id: "first-day",
    topicId: "school-life",
    title: "My First Day at School",
    subtitle: "A new gate, a new classroom, and one very kind classmate.",
    level: "Beginner",
    minutes: 3,
    sentences: [
      {
        id: "s1",
        text: "My name is Lily, and today is my first day at a new school.",
        translation: "我叫莉莉，今天是我在一所新学校的第一天。",
        grammar:
          "两个简单句用 'and' 并列连接。'is' 是系动词，连接主语和表语。",
      },
      {
        id: "s2",
        text: "I felt a little nervous when I walked through the gate.",
        translation: "走进校门的时候，我感到有点紧张。",
        grammar:
          "'felt' 是 'feel' 的过去式。'when' 引导时间状语从句，表示「当……的时候」。",
      },
      {
        id: "s3",
        text: "A kind teacher smiled at me and showed me to my classroom.",
        translation: "一位和蔼的老师对我微笑，并带我去了我的教室。",
        grammar:
          "两个并列动词 'smiled' 和 'showed' 共享主语 'A kind teacher'。",
      },
      {
        id: "s4",
        text: "My new classmates said hello and asked me where I was from.",
        translation: "新同学们和我打招呼，并问我来自哪里。",
        grammar:
          "'where I was from' 是宾语从句，作 'asked' 的宾语，从句要用陈述句语序。",
      },
      {
        id: "s5",
        text: "At lunchtime, a girl named Mia shared her sandwich with me.",
        translation: "午饭时间，一个叫米娅的女孩把她的三明治分给了我。",
        grammar:
          "'named Mia' 是过去分词短语，作 'a girl' 的后置定语。'share sth. with sb.' 是固定搭配。",
      },
      {
        id: "s6",
        text: "We talked about our favorite books and games.",
        translation: "我们聊了我们最喜欢的书和游戏。",
        grammar:
          "'talk about sth.' 表示「谈论某事」。'favorite' 在这里作形容词修饰 'books and games'。",
      },
      {
        id: "s7",
        text: "After school, we walked home together and promised to be friends.",
        translation: "放学后，我们一起走回家，并约定要做朋友。",
        grammar:
          "'promise to do sth.' 表示「答应做某事」，后面跟动词不定式。",
      },
      {
        id: "s8",
        text: "I came home feeling happy and excited about tomorrow.",
        translation: "我回到家时，对明天感到既开心又兴奋。",
        grammar:
          "'feeling happy and excited' 是现在分词短语，作伴随状语，表示主语回家时的状态。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question: "What does 'nervous' mean in the story?",
        options: [
          "Feeling worried or a little afraid",
          "Feeling very tired",
          "Feeling angry",
          "Feeling cold",
        ],
        correctAnswer: "Feeling worried or a little afraid",
        explanation:
          "Lily felt nervous walking through the gate — she was a little scared on her first day.",
      },
      {
        id: "q2",
        type: "detail",
        question: "Who shared her sandwich with Lily?",
        options: ["A teacher", "Her sister", "A girl named Mia", "Her mother"],
        correctAnswer: "A girl named Mia",
        explanation:
          "The story says: at lunchtime, a girl named Mia shared her sandwich with Lily.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "What is the story mainly about?",
        options: [
          "Lily makes a new friend on her first day",
          "How to pack a school lunch",
          "What teachers do at school",
          "How to find a classroom",
        ],
        correctAnswer: "Lily makes a new friend on her first day",
        explanation:
          "The story shows Lily moving from nervous to happy, and ending the day with a new friend.",
      },
      {
        id: "q4",
        type: "tense",
        question:
          "\"Mia shared her sandwich with Lily.\" What tense is 'shared'?",
        options: [
          "Past tense",
          "Present tense",
          "Future tense",
          "A command",
        ],
        correctAnswer: "Past tense",
        explanation:
          "'shared' is the past form of 'share'. The story already happened, so it uses the past tense.",
      },
      {
        id: "q5",
        type: "singular_plural",
        question:
          "Lily made one friend. If she made more, we would say she made many ___?",
        options: ["friends", "friend", "friendes", "friendies"],
        correctAnswer: "friends",
        explanation:
          "Most nouns become plural by adding -s: one friend → many friends.",
      },
      {
        id: "q6",
        type: "detail",
        question: "How did Lily feel at the very start of the day?",
        options: ["Nervous", "Angry", "Sleepy", "Bored"],
        correctAnswer: "Nervous",
        explanation:
          "At the beginning Lily felt nervous walking through the gate.",
      },
    ],
  },
  {
    id: "elephant-nose",
    topicId: "animals",
    title: "The Elephant's Long Nose",
    subtitle: "Lift logs, pick up peanuts — a trunk can do it all.",
    level: "Beginner",
    minutes: 3,
    sentences: [
      {
        id: "s1",
        text: "Have you ever seen an elephant up close?",
        translation: "你有没有近距离看过大象？",
        grammar:
          "现在完成时 'Have you ever seen' 用来询问经历，「你有没有……过？」。",
      },
      {
        id: "s2",
        text: "The first thing you notice is its long nose, called a trunk.",
        translation: "你第一眼会注意到的就是它那条长长的鼻子，叫做「trunk（象鼻）」。",
        grammar:
          "'you notice' 是省略 'that' 的定语从句，修饰 'thing'。'called a trunk' 是过去分词短语，作 'nose' 的后置定语。",
      },
      {
        id: "s3",
        text: "An elephant's trunk has more than forty thousand small muscles inside.",
        translation: "大象的鼻子里有超过四万块小肌肉。",
        grammar:
          "'more than' 表示「超过」。'inside' 在这里作副词，表示位置。",
      },
      {
        id: "s4",
        text: "It can lift heavy logs and pick up tiny peanuts at the same time.",
        translation: "它既能抬起沉重的木头，又能捡起小小的花生。",
        grammar:
          "情态动词 'can' 表示能力。'at the same time' 表示「同时」。",
      },
      {
        id: "s5",
        text: "Elephants use their trunks to drink water and put food in their mouths.",
        translation: "大象用鼻子喝水，并把食物送进嘴里。",
        grammar:
          "'use sth. to do sth.' 表示「用某物来做某事」，不定式表目的。",
      },
      {
        id: "s6",
        text: "They also use them to greet friends and gently touch their babies.",
        translation: "它们还用鼻子和朋友打招呼，轻轻地抚摸自己的宝宝。",
        grammar:
          "副词 'also' 表示递进。'gently' 是副词，修饰动词 'touch'。",
      },
      {
        id: "s7",
        text: "A baby elephant has to practice for months to learn to control its trunk.",
        translation: "一头小象要练习好几个月，才能学会控制自己的鼻子。",
        grammar:
          "'has to do sth.' 表示「必须做某事」。'for months' 表示动作持续的时间。",
      },
      {
        id: "s8",
        text: "Without this amazing nose, an elephant could not eat, drink, or play with its family.",
        translation: "如果没有这条神奇的鼻子，大象就没法吃东西、喝水，也没法和家人一起玩。",
        grammar:
          "'Without...' 表示一种「假设没有……」的虚拟条件。三个并列动词 'eat, drink, or play' 共享情态动词 'could not'。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question: "What is a 'trunk' in the story?",
        options: [
          "An elephant's long nose",
          "An elephant's tail",
          "An elephant's ear",
          "A box for travel",
        ],
        correctAnswer: "An elephant's long nose",
        explanation:
          "The second sentence tells us the long nose is called a trunk.",
      },
      {
        id: "q2",
        type: "detail",
        question: "How many small muscles are inside an elephant's trunk?",
        options: [
          "More than 100",
          "More than 1,000",
          "More than 40,000",
          "More than a million",
        ],
        correctAnswer: "More than 40,000",
        explanation:
          "The article says: more than forty thousand small muscles inside.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "What is the main idea of the article?",
        options: [
          "Elephants live in Africa and Asia",
          "Baby elephants are cute",
          "An elephant's trunk is amazing and very useful",
          "Elephants are the largest animals in the world",
        ],
        correctAnswer: "An elephant's trunk is amazing and very useful",
        explanation:
          "Most of the article describes what the trunk can do — drink, lift, eat, greet, protect.",
      },
      {
        id: "q4",
        type: "comparative",
        question:
          "An elephant's trunk is very strong. Compared with a human arm, a trunk is ___.",
        options: ["stronger", "strongest", "more strong", "strongly"],
        correctAnswer: "stronger",
        explanation:
          "Short adjectives add -er to compare two things: strong → stronger.",
      },
      {
        id: "q5",
        type: "singular_plural",
        question: "We see one elephant. If we see more, we say we see two ___?",
        options: ["elephants", "elephant", "elephantes", "elephanties"],
        correctAnswer: "elephants",
        explanation: "Add -s to make the plural: one elephant → two elephants.",
      },
    ],
  },
  {
    id: "why-seasons",
    topicId: "science",
    title: "Why Do We Have Seasons?",
    subtitle: "Spring, summer, autumn, winter — and why a tilted Earth matters.",
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "Have you ever wondered why we have spring, summer, autumn, and winter?",
        translation: "你有没有想过为什么我们会有春、夏、秋、冬四个季节？",
        grammar:
          "现在完成时 'Have you ever wondered' 表示询问经历。'why...' 引导宾语从句。",
      },
      {
        id: "s2",
        text: "The seasons are caused by the way Earth tilts as it travels around the sun.",
        translation: "季节是由地球绕着太阳运行时的倾斜方式造成的。",
        grammar:
          "'are caused by' 是被动语态。'as it travels...' 是 'as' 引导的时间状语从句，表示「在……的时候」。",
      },
      {
        id: "s3",
        text: "Earth is not perfectly straight up and down — it leans a little to one side.",
        translation: "地球并不是完全笔直的——它稍微向一边倾斜。",
        grammar:
          "破折号用来补充说明。'lean to one side' 表示「向一边倾斜」。",
      },
      {
        id: "s4",
        text: "When the part of Earth where you live tilts toward the sun, you get summer.",
        translation: "当你居住的那部分地球朝向太阳倾斜时，你那里就是夏天。",
        grammar:
          "'When' 引导时间状语从句。'where you live' 是定语从句，修饰 'the part of Earth'。",
      },
      {
        id: "s5",
        text: "The days are long, and the sunshine feels strong and warm.",
        translation: "白天很长，阳光感觉又强又暖。",
        grammar:
          "两个简单句用 'and' 并列。'feel + 形容词' 表示「感觉……」。",
      },
      {
        id: "s6",
        text: "Six months later, your part of Earth tilts away from the sun.",
        translation: "六个月后，你所在的那部分地球会朝远离太阳的方向倾斜。",
        grammar:
          "'tilt away from' 表示「向远离……的方向倾斜」，与上一段的 'tilt toward' 形成对比。",
      },
      {
        id: "s7",
        text: "The days become short, and the weather turns cold — that is winter.",
        translation: "白天变短，天气变冷——那就是冬天。",
        grammar:
          "'become' 和 'turn' 都是连系动词，后面接形容词，表示状态变化。",
      },
      {
        id: "s8",
        text: "Spring and autumn happen in between, when your part of Earth is neither too close nor too far from the sun's strongest light.",
        translation: "春天和秋天发生在两者之间，那时你所在的那部分地球离太阳最强的光线既不太近也不太远。",
        grammar:
          "'when...' 是定语从句，进一步说明 'in between'。'neither...nor...' 表示「既不……也不……」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question: "What does 'tilt' mean in the article?",
        options: [
          "To lean to one side",
          "To grow bigger",
          "To spin in a circle",
          "To stop moving",
        ],
        correctAnswer: "To lean to one side",
        explanation:
          "The article says Earth 'leans a little to one side' — that is what tilting means.",
      },
      {
        id: "q2",
        type: "detail",
        question:
          "When the part of Earth where you live tilts toward the sun, what season is it?",
        options: ["Spring", "Summer", "Autumn", "Winter"],
        correctAnswer: "Summer",
        explanation:
          "The article says: when your part of Earth tilts toward the sun, you get summer.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "Why do we have seasons, according to the article?",
        options: [
          "Because the sun moves around Earth",
          "Because Earth gets closer to the sun in summer",
          "Because Earth tilts as it travels around the sun",
          "Because the air changes color",
        ],
        correctAnswer: "Because Earth tilts as it travels around the sun",
        explanation:
          "This is the article's main answer, stated in the second sentence.",
      },
      {
        id: "q4",
        type: "comparative",
        question:
          "In summer the days are long. In winter, the days are ___ than in summer.",
        options: ["shorter", "shortest", "more short", "shortly"],
        correctAnswer: "shorter",
        explanation:
          "Short adjectives add -er to compare two things: short → shorter.",
      },
      {
        id: "q5",
        type: "tense",
        question:
          "\"Earth tilts as it travels around the sun.\" What tense are 'tilts' and 'travels'?",
        options: [
          "Simple present",
          "Simple past",
          "Future",
          "Present continuous",
        ],
        correctAnswer: "Simple present",
        explanation:
          "These are facts that are always true, so the article uses the simple present tense.",
      },
    ],
  },
  {
    id: "healthy-day",
    topicId: "health",
    title: "A Healthy Day",
    subtitle: "Grandpa is 70 — and his secret is a few small habits.",
    level: "Beginner",
    minutes: 3,
    sentences: [
      {
        id: "s1",
        text: "My grandfather is seventy years old, but he is still very healthy.",
        translation: "我的爷爷七十岁了，但他依然非常健康。",
        grammar:
          "'be + 数字 + years old' 表示年龄。副词 'still' 表示「依然，仍然」。",
      },
      {
        id: "s2",
        text: "He says the secret is a few simple habits.",
        translation: "他说，秘诀就是几个简单的小习惯。",
        grammar:
          "'says' 后省略了 'that'，引导宾语从句。'a few' 用于可数名词复数，表示「一些，几个」。",
      },
      {
        id: "s3",
        text: "Every morning, he wakes up early and drinks a big glass of warm water.",
        translation: "每天早上，他都早早起床，喝一大杯温水。",
        grammar:
          "两个并列动词 'wakes up' 和 'drinks' 共享主语 'he'。'a glass of' 是常用量词搭配。",
      },
      {
        id: "s4",
        text: "After breakfast, he goes for a walk in the park for thirty minutes.",
        translation: "早餐后，他会去公园散步三十分钟。",
        grammar:
          "'go for a walk' 是固定搭配，意思是「去散步」。'for thirty minutes' 表示动作持续的时间。",
      },
      {
        id: "s5",
        text: "He eats lots of vegetables and fruit, and he never skips meals.",
        translation: "他吃很多蔬菜和水果，从不省略任何一餐。",
        grammar:
          "'lots of' 与「可数复数 / 不可数」名词都可搭配。'never' 是否定副词，提到动词前。",
      },
      {
        id: "s6",
        text: "In the afternoon, he plays table tennis with his friends.",
        translation: "下午，他和朋友们打乒乓球。",
        grammar:
          "球类运动前不加冠词：'play table tennis'，不说 'play the table tennis'。",
      },
      {
        id: "s7",
        text: "Before bed, he reads a book instead of watching his phone.",
        translation: "睡觉前，他读书，而不是看手机。",
        grammar:
          "'instead of' 后接名词或动名词，表示「而不是……」。",
      },
      {
        id: "s8",
        text: "He always says, \"A healthy day makes a healthy life.\"",
        translation: "他总是说：「健康的一天造就健康的一生。」",
        grammar:
          "直接引语用引号引出。'make' 在这里是「造就，形成」的意思。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question: "What is a 'habit'?",
        options: [
          "Something you do often, usually without thinking",
          "A special meal eaten on holidays",
          "A type of outdoor game",
          "A kind of clothing",
        ],
        correctAnswer: "Something you do often, usually without thinking",
        explanation:
          "Grandfather's 'simple habits' are the small things he does every day.",
      },
      {
        id: "q2",
        type: "detail",
        question: "What does Grandfather drink first thing every morning?",
        options: [
          "Hot coffee",
          "A big glass of warm water",
          "Orange juice",
          "Green tea",
        ],
        correctAnswer: "A big glass of warm water",
        explanation:
          "The article says: he wakes up early and drinks a big glass of warm water.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "What is the main lesson of the story?",
        options: [
          "Grandfather is too old to exercise",
          "Walking is the only way to stay healthy",
          "Small daily habits can keep you healthy",
          "You should never use your phone",
        ],
        correctAnswer: "Small daily habits can keep you healthy",
        explanation:
          "Grandfather's secret is several small habits — water, walking, vegetables, reading — done every day.",
      },
    ],
  },
  {
    id: "favorite-festival",
    topicId: "festivals",
    title: "My Favorite Festival",
    subtitle: "Red envelopes, fireworks, and a big family dinner.",
    level: "Beginner",
    minutes: 3,
    sentences: [
      {
        id: "s1",
        text: "My favorite festival is the Spring Festival, also called Chinese New Year.",
        translation: "我最喜欢的节日是春节，也叫中国新年。",
        grammar:
          "'also called Chinese New Year' 是过去分词短语，作 'the Spring Festival' 的后置定语。",
      },
      {
        id: "s2",
        text: "A few days before the festival, my mom and I clean every corner of our home.",
        translation: "节日前几天，我和妈妈会把家里的每个角落都打扫一遍。",
        grammar:
          "'a few days before...' 是时间状语。'every + 单数名词' 表示「每一个……」。",
      },
      {
        id: "s3",
        text: "We put red paper decorations on the doors and windows for good luck.",
        translation: "我们在门窗上贴上红色的纸饰，希望带来好运。",
        grammar:
          "'put sth. on sth.' 表示「把某物放在/贴在某处」。'for good luck' 表示目的。",
      },
      {
        id: "s4",
        text: "On New Year's Eve, my whole family gathers for a big dinner together.",
        translation: "除夕夜，我全家人会聚在一起吃一顿丰盛的年夜饭。",
        grammar:
          "'On + 具体某天' 用于表示日期。'the whole family' 作主语时，谓语用单数 'gathers'。",
      },
      {
        id: "s5",
        text: "My grandparents give me red envelopes with money inside.",
        translation: "爷爷奶奶会给我里面装着钱的红包。",
        grammar:
          "'give sb. sth.' 是双宾语结构。'with money inside' 是「with + 名词 + 副词」复合结构，作 'envelopes' 的后置定语。",
      },
      {
        id: "s6",
        text: "At midnight, we go outside to watch fireworks light up the sky.",
        translation: "午夜时分，我们到外面去看烟花把夜空点亮。",
        grammar:
          "'watch sb./sth. do sth.' 是「感官动词 + 宾语 + 动词原形」结构，强调看到完整过程。",
      },
      {
        id: "s7",
        text: "For the next few days, we visit relatives and share good wishes.",
        translation: "接下来的几天里，我们会去拜访亲戚，互送祝福。",
        grammar:
          "'For the next few days' 是时间状语。'share' 表示「分享」。",
      },
      {
        id: "s8",
        text: "I love this festival because it brings my whole family together.",
        translation: "我喜欢这个节日，因为它能让我们全家团聚。",
        grammar:
          "'because' 引导原因状语从句。'bring sb. together' 表示「让某些人聚到一起」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question:
          "What does 'gather' mean in 'the whole family gathers for a big dinner'?",
        options: ["To leave", "To come together", "To run fast", "To sleep"],
        correctAnswer: "To come together",
        explanation:
          "When a family gathers, they all come to one place together.",
      },
      {
        id: "q2",
        type: "detail",
        question: "What is inside the red envelopes?",
        options: ["Candy", "Money", "Toy cars", "Photos"],
        correctAnswer: "Money",
        explanation: "The article says: red envelopes with money inside.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "Why does the writer love the Spring Festival the most?",
        options: [
          "Because of the food only",
          "Because of the fireworks only",
          "Because it brings the whole family together",
          "Because there is no school",
        ],
        correctAnswer: "Because it brings the whole family together",
        explanation:
          "The last sentence states this directly: 'it brings my whole family together.'",
      },
    ],
  },
  {
    id: "olympic-games",
    topicId: "famous-people",
    title: "The Story of the Olympic Games",
    subtitle: "From ancient Greece to athletes from every country today.",
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "The Olympic Games are the biggest sports event in the world.",
        translation: "奥林匹克运动会是世界上最大的体育盛会。",
        grammar:
          "'the biggest' 是形容词最高级。'in the world' 是介词短语，限定范围。",
      },
      {
        id: "s2",
        text: "They started more than two thousand years ago in ancient Greece.",
        translation: "它在两千多年前的古希腊就已经开始了。",
        grammar:
          "'more than' 表示「超过」。'ago' 用于过去时，表示「……以前」。",
      },
      {
        id: "s3",
        text: "At first, only Greek men were allowed to take part in the games.",
        translation: "起初，只有希腊男子被允许参加比赛。",
        grammar:
          "'were allowed to' 是被动语态，表示「被允许做……」。'take part in' 表示「参加」。",
      },
      {
        id: "s4",
        text: "They ran races, threw a heavy disc, and competed in wrestling and jumping.",
        translation: "他们赛跑、投掷沉重的铁饼，还参加摔跤和跳跃比赛。",
        grammar:
          "三个并列动词 'ran, threw, competed' 共享主语 'They'。'compete in' 表示「在某项目中比赛」。",
      },
      {
        id: "s5",
        text: "After many centuries, the games were stopped for a long time.",
        translation: "过了好几个世纪以后，奥运会曾经被停办了很长一段时间。",
        grammar:
          "'were stopped' 是被动语态，表示「被停办」。'for a long time' 表示一段时间。",
      },
      {
        id: "s6",
        text: "In 1896, a French man named Pierre de Coubertin brought the Olympic Games back.",
        translation: "1896 年，一位名叫皮埃尔·德·顾拜旦的法国人让奥林匹克运动会重新回到了世界。",
        grammar:
          "'named Pierre de Coubertin' 是过去分词短语，作 'a French man' 的后置定语。'bring sth. back' 表示「让某物回归」。",
      },
      {
        id: "s7",
        text: "Today, athletes from almost every country come together to compete every four years.",
        translation: "如今，几乎每个国家的运动员都会每四年聚到一起进行比赛。",
        grammar:
          "'from almost every country' 是介词短语，作 'athletes' 的后置定语。'every four years' 表示「每隔四年」。",
      },
      {
        id: "s8",
        text: "The Olympic Games remind us that sport can bring people from different places together as friends.",
        translation: "奥林匹克运动会提醒我们：体育能把来自不同地方的人们当作朋友聚到一起。",
        grammar:
          "'remind sb. that...' 中的 'that' 引导宾语从句。'bring sb. together as friends' 表示「让……作为朋友聚到一起」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question: "What does 'ancient' mean?",
        options: [
          "Very new",
          "Very far away",
          "Very old, from long ago",
          "Very small",
        ],
        correctAnswer: "Very old, from long ago",
        explanation:
          "'Ancient Greece' is a country from more than two thousand years ago.",
      },
      {
        id: "q2",
        type: "detail",
        question: "Who brought the Olympic Games back in 1896?",
        options: [
          "A Greek king",
          "A French man named Pierre de Coubertin",
          "An American athlete",
          "A Roman emperor",
        ],
        correctAnswer: "A French man named Pierre de Coubertin",
        explanation:
          "The article names Pierre de Coubertin and the year 1896 directly.",
      },
      {
        id: "q3",
        type: "main_idea",
        question:
          "What does the Olympic Games teach us, according to the article?",
        options: [
          "Greek athletes are the strongest",
          "Running is the most important sport",
          "Sport can bring people from different places together",
          "Only men can take part in the games",
        ],
        correctAnswer:
          "Sport can bring people from different places together",
        explanation:
          "This is the message in the last sentence — sport unites people as friends.",
      },
    ],
  },
  {
    id: "young-inventor",
    topicId: "young-inventor",
    title: "A Young Inventor",
    subtitle: "Tom is 12, and his first invention is a cup that won't tip over.",
    level: "Beginner",
    minutes: 3,
    sentences: [
      {
        id: "s1",
        text: "Tom is only twelve years old, but he is already an inventor.",
        translation: "汤姆只有十二岁，但他已经是一名小发明家了。",
        grammar:
          "副词 'only' 强调「仅仅，只有」。副词 'already' 表示「已经」，常和现在时连用。",
      },
      {
        id: "s2",
        text: "One winter, he saw his grandmother's hands shake when she tried to drink water.",
        translation: "有一年冬天，他看到奶奶喝水时双手在发抖。",
        grammar:
          "'see sb. do sth.' 是「感官动词 + 宾语 + 动词原形」结构，强调看到全过程。'when' 引导时间状语从句。",
      },
      {
        id: "s3",
        text: "He wanted to help her, so he started thinking of ideas.",
        translation: "他想帮助奶奶，于是开始想各种办法。",
        grammar:
          "'so' 引出结果状语从句。'start doing sth.' 和 'start to do sth.' 都表示「开始做某事」。",
      },
      {
        id: "s4",
        text: "Tom built a special cup with a heavy bottom and a soft handle.",
        translation: "汤姆做了一个特别的杯子，杯底很重，把手很柔软。",
        grammar:
          "'with a heavy bottom and a soft handle' 是介词短语，作 'cup' 的后置定语，描述杯子的特征。",
      },
      {
        id: "s5",
        text: "The cup did not fall over, and his grandmother could hold it easily.",
        translation: "这个杯子不会倒，奶奶可以轻松地握住它。",
        grammar:
          "'fall over' 表示「倒下」。情态动词 'could' 在这里表示「能够」。",
      },
      {
        id: "s6",
        text: "He used some old toy parts and bottle caps to make the first one.",
        translation: "他用了一些旧玩具零件和瓶盖做了第一个杯子。",
        grammar:
          "'some' 用于肯定句，表示「一些」。代词 'one' 在这里指代前面提到的 'cup'。",
      },
      {
        id: "s7",
        text: "His teacher saw the cup and helped Tom show his idea at a school science fair.",
        translation: "他的老师看到了这个杯子，并帮助汤姆在学校的科学展上展示他的想法。",
        grammar:
          "'help sb. do sth.' 表示「帮助某人做某事」。'at a school science fair' 是地点状语。",
      },
      {
        id: "s8",
        text: "Tom learned that a great invention does not have to be big — it just has to help someone.",
        translation: "汤姆懂得了：一项伟大的发明不一定要很庞大——它只需要能帮到某个人就好。",
        grammar:
          "'that' 引导宾语从句作 'learned' 的宾语。'does not have to' 表示「不必」，'has to' 表示「必须」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question: "What is an 'inventor'?",
        options: [
          "A person who teaches science",
          "A person who creates something new",
          "A person who sells toys",
          "A person who fixes cars",
        ],
        correctAnswer: "A person who creates something new",
        explanation:
          "Tom is called an inventor because he created a new kind of cup.",
      },
      {
        id: "q2",
        type: "detail",
        question: "Why did Tom build a special cup?",
        options: [
          "To win a school prize",
          "Because his grandmother's hands shake when she drinks",
          "Because his old cup broke",
          "For his science homework",
        ],
        correctAnswer:
          "Because his grandmother's hands shake when she drinks",
        explanation:
          "Tom wanted to help his grandmother — that is the reason in the article.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "What lesson does Tom learn at the end?",
        options: [
          "A great invention does not have to be big — it just has to help someone",
          "You need expensive parts to invent things",
          "Children cannot be inventors",
          "Cups should always be made of plastic",
        ],
        correctAnswer:
          "A great invention does not have to be big — it just has to help someone",
        explanation: "This is exactly what the last sentence tells us.",
      },
    ],
  },
  {
    id: "robots-help",
    topicId: "robots",
    title: "How Robots Help People",
    subtitle: "From factories to hospitals, robots are quietly helping us every day.",
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "Robots are not just toys or movie characters — they help people every day.",
        translation: "机器人不仅仅是玩具或电影里的角色——它们每天都在帮助人们。",
        grammar:
          "'not just...' 表示「不仅仅是……」，常与 'but also' 搭配，这里用破折号代替。",
      },
      {
        id: "s2",
        text: "In factories, robots build cars by joining heavy metal parts together.",
        translation: "在工厂里，机器人通过把沉重的金属零件拼接在一起来造汽车。",
        grammar:
          "'by + 动名词' 表示方式，「通过做……」。'join...together' 表示「把……连在一起」。",
      },
      {
        id: "s3",
        text: "In hospitals, they carry medicine to patients and help doctors during operations.",
        translation: "在医院里，它们把药品送给病人，并在手术中协助医生。",
        grammar:
          "'carry sth. to sb.' 表示「把某物送到某人那里」。'during' 用于一段事件期间。",
      },
      {
        id: "s4",
        text: "At home, small round robots can clean the floor by themselves.",
        translation: "在家里，圆圆的小机器人能自己打扫地板。",
        grammar:
          "'by themselves' 表示「靠它们自己」，强调独立完成。'small round' 是两个形容词同时修饰 'robots'。",
      },
      {
        id: "s5",
        text: "Some robots even help children learn English by talking with them.",
        translation: "有些机器人甚至会通过和孩子们对话，帮助他们学英语。",
        grammar:
          "'help sb. do sth.' 表示「帮助某人做某事」。'by talking with them' 是「by + 动名词」结构，表示方式。",
      },
      {
        id: "s6",
        text: "In dangerous places, robots can do work that is too risky for humans.",
        translation: "在危险的地方，机器人可以做那些对人类来说太冒险的工作。",
        grammar:
          "'that is too risky for humans' 是定语从句，修饰 'work'。'too...for sb.' 表示「对某人来说太……」。",
      },
      {
        id: "s7",
        text: "Scientists are also building robots that can explore the deep ocean and other planets.",
        translation: "科学家们也在制造能够探索深海和其他星球的机器人。",
        grammar:
          "现在进行时 'are building' 表示当前正在进行的动作。'that can explore...' 是定语从句，修饰 'robots'。",
      },
      {
        id: "s8",
        text: "As technology gets better, robots will help us in even more ways in the future.",
        translation: "随着科技变得越来越好，机器人将来会以更多的方式帮助我们。",
        grammar:
          "'As' 引导时间状语从句，表示「随着……」。'even more' 是「更加」的强调形式。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        question: "What does 'risky' mean in the article?",
        options: [
          "Easy and safe",
          "Possibly causing harm",
          "Quick and quiet",
          "Far away",
        ],
        correctAnswer: "Possibly causing harm",
        explanation:
          "The article uses 'risky' for work that is too dangerous for humans.",
      },
      {
        id: "q2",
        type: "detail",
        question: "How do robots help in hospitals, according to the article?",
        options: [
          "They only clean the floors",
          "They carry medicine to patients and help doctors during operations",
          "They drive ambulances",
          "They sell food in the cafeteria",
        ],
        correctAnswer:
          "They carry medicine to patients and help doctors during operations",
        explanation:
          "Sentence three lists these two specific hospital tasks for robots.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "What is the main idea of the article?",
        options: [
          "Robots can do scary things",
          "Robots are not useful at all",
          "Robots help people in many ways every day",
          "Robots only appear in movies",
        ],
        correctAnswer: "Robots help people in many ways every day",
        explanation:
          "The article gives many examples — factories, hospitals, homes, dangerous places — to make this point.",
      },
    ],
  },
];

export const dictionary: Record<string, WordEntry> = {
  // school-life
  nervous: {
    word: "nervous",
    pronunciation: "/ˈnɜːr.vəs/",
    partOfSpeech: "adj.",
    definition: "Feeling worried or a little afraid.",
    translation: "紧张的；不安的",
    example: "I always feel nervous before a test.",
    exampleTranslation: "考试前我总是感到紧张。",
  },
  gate: {
    word: "gate",
    pronunciation: "/ɡeɪt/",
    partOfSpeech: "n.",
    definition: "A door in a fence or wall, often at the entrance to a place.",
    translation: "大门；校门",
    example: "We met at the school gate.",
    exampleTranslation: "我们在校门口见面了。",
  },
  classroom: {
    word: "classroom",
    pronunciation: "/ˈklæs.ruːm/",
    partOfSpeech: "n.",
    definition: "A room in a school where students have lessons.",
    translation: "教室",
    example: "Our classroom is on the second floor.",
    exampleTranslation: "我们的教室在二楼。",
  },
  classmates: {
    word: "classmates",
    pronunciation: "/ˈklæs.meɪts/",
    partOfSpeech: "n.",
    definition: "Plural of 'classmate': students in the same class as you.",
    translation: "同班同学（复数）",
    example: "My classmates threw me a birthday party.",
    exampleTranslation: "我的同学们为我办了一个生日派对。",
  },
  lunchtime: {
    word: "lunchtime",
    pronunciation: "/ˈlʌntʃ.taɪm/",
    partOfSpeech: "n.",
    definition: "The time of day when people eat lunch.",
    translation: "午餐时间",
    example: "I usually read at lunchtime.",
    exampleTranslation: "我午餐时间通常会看书。",
  },
  shared: {
    word: "shared",
    pronunciation: "/ʃerd/",
    partOfSpeech: "v.",
    definition: "Past form of 'share': to give part of something to others.",
    translation: "分享；分给（过去式）",
    example: "She shared her cookies with us.",
    exampleTranslation: "她把饼干分给了我们。",
  },
  sandwich: {
    word: "sandwich",
    pronunciation: "/ˈsæn.wɪtʃ/",
    partOfSpeech: "n.",
    definition: "Two pieces of bread with food in the middle.",
    translation: "三明治",
    example: "I had a cheese sandwich for lunch.",
    exampleTranslation: "我午饭吃了一个奶酪三明治。",
  },
  favorite: {
    word: "favorite",
    pronunciation: "/ˈfeɪ.vər.ɪt/",
    partOfSpeech: "adj.",
    definition: "The one you like the most.",
    translation: "最喜欢的",
    example: "Blue is my favorite color.",
    exampleTranslation: "蓝色是我最喜欢的颜色。",
  },
  promised: {
    word: "promised",
    pronunciation: "/ˈprɒm.ɪst/",
    partOfSpeech: "v.",
    definition: "Past form of 'promise': to say you will surely do something.",
    translation: "答应；许诺（过去式）",
    example: "He promised to call me tonight.",
    exampleTranslation: "他答应今晚给我打电话。",
  },
  excited: {
    word: "excited",
    pronunciation: "/ɪkˈsaɪ.tɪd/",
    partOfSpeech: "adj.",
    definition: "Feeling very happy and full of energy about something.",
    translation: "兴奋的",
    example: "The kids are excited about the trip.",
    exampleTranslation: "孩子们对这次旅行感到兴奋。",
  },

  // animals
  elephant: {
    word: "elephant",
    pronunciation: "/ˈel.ɪ.fənt/",
    partOfSpeech: "n.",
    definition: "A very large gray animal with a long trunk and big ears.",
    translation: "大象",
    example: "An elephant can weigh more than five tons.",
    exampleTranslation: "一头大象的体重可以超过五吨。",
  },
  trunk: {
    word: "trunk",
    pronunciation: "/trʌŋk/",
    partOfSpeech: "n.",
    definition: "The long nose of an elephant.",
    translation: "象鼻",
    example: "The elephant lifted the log with its trunk.",
    exampleTranslation: "大象用鼻子把木头抬了起来。",
  },
  muscles: {
    word: "muscles",
    pronunciation: "/ˈmʌs.əlz/",
    partOfSpeech: "n.",
    definition: "Plural of 'muscle': the soft parts inside your body that help you move.",
    translation: "肌肉",
    example: "Lifting weights makes your muscles stronger.",
    exampleTranslation: "举重能让你的肌肉更强壮。",
  },
  lift: {
    word: "lift",
    pronunciation: "/lɪft/",
    partOfSpeech: "v.",
    definition: "To raise something up.",
    translation: "举起；抬起",
    example: "Can you lift this box for me?",
    exampleTranslation: "你能帮我把这个箱子搬起来吗？",
  },
  logs: {
    word: "logs",
    pronunciation: "/lɔːɡz/",
    partOfSpeech: "n.",
    definition: "Plural of 'log': thick pieces of wood from a tree.",
    translation: "木头；原木（复数）",
    example: "We added some logs to the fire.",
    exampleTranslation: "我们往火里加了一些木头。",
  },
  peanuts: {
    word: "peanuts",
    pronunciation: "/ˈpiː.nʌts/",
    partOfSpeech: "n.",
    definition: "Plural of 'peanut': small nuts that grow under the ground.",
    translation: "花生（复数）",
    example: "Elephants love to eat peanuts.",
    exampleTranslation: "大象喜欢吃花生。",
  },
  greet: {
    word: "greet",
    pronunciation: "/ɡriːt/",
    partOfSpeech: "v.",
    definition: "To say hello to someone.",
    translation: "问候；打招呼",
    example: "She greeted us with a big smile.",
    exampleTranslation: "她用灿烂的笑容向我们问好。",
  },
  babies: {
    word: "babies",
    pronunciation: "/ˈbeɪ.biz/",
    partOfSpeech: "n.",
    definition: "Plural of 'baby': very young children or animals.",
    translation: "宝宝（复数）",
    example: "Baby elephants stay close to their mothers.",
    exampleTranslation: "小象会紧紧跟在妈妈身边。",
  },
  practice: {
    word: "practice",
    pronunciation: "/ˈpræk.tɪs/",
    partOfSpeech: "v.",
    definition: "To do something many times to become better at it.",
    translation: "练习",
    example: "I practice the piano every evening.",
    exampleTranslation: "我每天晚上都练钢琴。",
  },
  control: {
    word: "control",
    pronunciation: "/kənˈtroʊl/",
    partOfSpeech: "v.",
    definition: "To make something move or work the way you want.",
    translation: "控制",
    example: "Try to control your speed when going downhill.",
    exampleTranslation: "下坡时要控制好速度。",
  },
  amazing: {
    word: "amazing",
    pronunciation: "/əˈmeɪ.zɪŋ/",
    partOfSpeech: "adj.",
    definition: "Very surprising in a good way.",
    translation: "令人惊奇的",
    example: "The view from the top is amazing.",
    exampleTranslation: "从顶上看的风景令人惊叹。",
  },

  // science / seasons
  wondered: {
    word: "wondered",
    pronunciation: "/ˈwʌn.dərd/",
    partOfSpeech: "v.",
    definition: "Past form of 'wonder': to ask yourself a question or feel curious.",
    translation: "想知道；好奇（过去式）",
    example: "I wondered why he was late.",
    exampleTranslation: "我想知道他为什么迟到了。",
  },
  seasons: {
    word: "seasons",
    pronunciation: "/ˈsiː.zənz/",
    partOfSpeech: "n.",
    definition: "Plural of 'season': spring, summer, autumn, and winter.",
    translation: "季节（复数）",
    example: "There are four seasons in a year.",
    exampleTranslation: "一年有四个季节。",
  },
  autumn: {
    word: "autumn",
    pronunciation: "/ˈɔː.təm/",
    partOfSpeech: "n.",
    definition: "The season after summer, when leaves change color and fall.",
    translation: "秋天",
    example: "Autumn is my favorite season.",
    exampleTranslation: "秋天是我最喜欢的季节。",
  },
  winter: {
    word: "winter",
    pronunciation: "/ˈwɪn.tər/",
    partOfSpeech: "n.",
    definition: "The cold season after autumn.",
    translation: "冬天",
    example: "It often snows in winter.",
    exampleTranslation: "冬天经常下雪。",
  },
  caused: {
    word: "caused",
    pronunciation: "/kɔːzd/",
    partOfSpeech: "v.",
    definition: "Past form of 'cause': to make something happen.",
    translation: "造成；引起（过去式）",
    example: "The storm caused a lot of damage.",
    exampleTranslation: "这场风暴造成了很大的破坏。",
  },
  tilts: {
    word: "tilts",
    pronunciation: "/tɪlts/",
    partOfSpeech: "v.",
    definition: "Third-person form of 'tilt': to lean to one side.",
    translation: "倾斜",
    example: "The tower tilts a little to the left.",
    exampleTranslation: "这座塔稍微向左倾斜。",
  },
  earth: {
    word: "earth",
    pronunciation: "/ɜːrθ/",
    partOfSpeech: "n.",
    definition: "The planet we live on.",
    translation: "地球",
    example: "Earth moves around the sun.",
    exampleTranslation: "地球围着太阳转。",
  },
  sun: {
    word: "sun",
    pronunciation: "/sʌn/",
    partOfSpeech: "n.",
    definition: "The bright star that gives us light and warmth during the day.",
    translation: "太阳",
    example: "The sun rises in the east.",
    exampleTranslation: "太阳从东方升起。",
  },
  leans: {
    word: "leans",
    pronunciation: "/liːnz/",
    partOfSpeech: "v.",
    definition: "Third-person form of 'lean': to bend or slope to one side.",
    translation: "倾斜；倚靠",
    example: "The old fence leans to one side.",
    exampleTranslation: "那道老围栏向一边倾斜。",
  },
  weather: {
    word: "weather",
    pronunciation: "/ˈweð.ər/",
    partOfSpeech: "n.",
    definition: "What it is like outside — sunny, rainy, hot, cold, etc.",
    translation: "天气",
    example: "The weather is nice today.",
    exampleTranslation: "今天天气很好。",
  },
  sunshine: {
    word: "sunshine",
    pronunciation: "/ˈsʌn.ʃaɪn/",
    partOfSpeech: "n.",
    definition: "The light and warmth from the sun.",
    translation: "阳光",
    example: "We sat in the sunshine all afternoon.",
    exampleTranslation: "我们整个下午都坐在阳光下。",
  },

  // health / healthy day
  grandfather: {
    word: "grandfather",
    pronunciation: "/ˈɡrænd.fɑː.ðər/",
    partOfSpeech: "n.",
    definition: "The father of your mother or father.",
    translation: "祖父；外祖父；爷爷；外公",
    example: "My grandfather tells the best stories.",
    exampleTranslation: "我爷爷讲的故事最好听。",
  },
  healthy: {
    word: "healthy",
    pronunciation: "/ˈhel.θi/",
    partOfSpeech: "adj.",
    definition: "In good physical or mental condition.",
    translation: "健康的",
    example: "Eating vegetables helps you stay healthy.",
    exampleTranslation: "吃蔬菜有助于保持健康。",
  },
  secret: {
    word: "secret",
    pronunciation: "/ˈsiː.krɪt/",
    partOfSpeech: "n.",
    definition: "Something that you do not tell other people.",
    translation: "秘密；秘诀",
    example: "Her secret to good cooking is fresh food.",
    exampleTranslation: "她做菜好吃的秘诀是用新鲜食材。",
  },
  habits: {
    word: "habits",
    pronunciation: "/ˈhæb.ɪts/",
    partOfSpeech: "n.",
    definition: "Plural of 'habit': things you do often, usually without thinking.",
    translation: "习惯（复数）",
    example: "Reading every day is a good habit.",
    exampleTranslation: "每天阅读是一个好习惯。",
  },
  breakfast: {
    word: "breakfast",
    pronunciation: "/ˈbrek.fəst/",
    partOfSpeech: "n.",
    definition: "The first meal of the day.",
    translation: "早餐",
    example: "I always have breakfast before school.",
    exampleTranslation: "我上学前总会吃早餐。",
  },
  vegetables: {
    word: "vegetables",
    pronunciation: "/ˈvedʒ.tə.bəlz/",
    partOfSpeech: "n.",
    definition: "Plural of 'vegetable': plants such as carrots and broccoli that you eat.",
    translation: "蔬菜（复数）",
    example: "Vegetables are good for your body.",
    exampleTranslation: "蔬菜对身体有好处。",
  },
  fruit: {
    word: "fruit",
    pronunciation: "/fruːt/",
    partOfSpeech: "n.",
    definition: "The sweet part of a plant that contains seeds, like an apple or banana.",
    translation: "水果",
    example: "An apple is my favorite fruit.",
    exampleTranslation: "苹果是我最喜欢的水果。",
  },
  meals: {
    word: "meals",
    pronunciation: "/miːlz/",
    partOfSpeech: "n.",
    definition: "Plural of 'meal': the food you eat at one time, like breakfast or dinner.",
    translation: "餐；饭（复数）",
    example: "We have three meals a day.",
    exampleTranslation: "我们一天吃三顿饭。",
  },
  instead: {
    word: "instead",
    pronunciation: "/ɪnˈsted/",
    partOfSpeech: "adv.",
    definition: "In the place of something else.",
    translation: "代替；反而",
    example: "I had tea instead of coffee.",
    exampleTranslation: "我喝了茶，没喝咖啡。",
  },

  // festivals
  spring: {
    word: "spring",
    pronunciation: "/sprɪŋ/",
    partOfSpeech: "n.",
    definition: "The season after winter, when plants start to grow again.",
    translation: "春天",
    example: "Flowers bloom in the spring.",
    exampleTranslation: "花朵在春天盛开。",
  },
  festival: {
    word: "festival",
    pronunciation: "/ˈfes.tɪ.vəl/",
    partOfSpeech: "n.",
    definition: "A special day or time when people celebrate something.",
    translation: "节日",
    example: "The Mid-Autumn Festival is in autumn.",
    exampleTranslation: "中秋节在秋天。",
  },
  corner: {
    word: "corner",
    pronunciation: "/ˈkɔːr.nər/",
    partOfSpeech: "n.",
    definition: "The place where two walls or edges meet.",
    translation: "角落",
    example: "The cat is sleeping in the corner.",
    exampleTranslation: "那只猫正在角落里睡觉。",
  },
  decorations: {
    word: "decorations",
    pronunciation: "/ˌdek.əˈreɪ.ʃənz/",
    partOfSpeech: "n.",
    definition: "Plural of 'decoration': pretty things used to make a place look nice.",
    translation: "装饰品（复数）",
    example: "We put up decorations for the party.",
    exampleTranslation: "我们为派对挂上了装饰。",
  },
  luck: {
    word: "luck",
    pronunciation: "/lʌk/",
    partOfSpeech: "n.",
    definition: "Good things happening by chance.",
    translation: "运气",
    example: "Good luck on your test!",
    exampleTranslation: "祝你考试好运！",
  },
  gathers: {
    word: "gathers",
    pronunciation: "/ˈɡæð.ərz/",
    partOfSpeech: "v.",
    definition: "Third-person form of 'gather': to come together in one place.",
    translation: "聚集",
    example: "The class gathers in the hall every Monday.",
    exampleTranslation: "全班每周一在大厅集合。",
  },
  grandparents: {
    word: "grandparents",
    pronunciation: "/ˈɡrænd.per.ənts/",
    partOfSpeech: "n.",
    definition: "Your grandfather and grandmother.",
    translation: "祖父母；外祖父母",
    example: "I visit my grandparents every weekend.",
    exampleTranslation: "我每个周末都去看望爷爷奶奶。",
  },
  envelopes: {
    word: "envelopes",
    pronunciation: "/ˈen.və.loʊps/",
    partOfSpeech: "n.",
    definition: "Plural of 'envelope': folded paper covers used to hold letters or money.",
    translation: "信封（复数）",
    example: "Red envelopes are common during the Spring Festival.",
    exampleTranslation: "红包在春节期间很常见。",
  },
  midnight: {
    word: "midnight",
    pronunciation: "/ˈmɪd.naɪt/",
    partOfSpeech: "n.",
    definition: "Twelve o'clock at night.",
    translation: "午夜；半夜十二点",
    example: "We stayed up until midnight.",
    exampleTranslation: "我们一直熬到午夜。",
  },
  fireworks: {
    word: "fireworks",
    pronunciation: "/ˈfaɪr.wɜːrks/",
    partOfSpeech: "n.",
    definition: "Small things that explode in the sky with bright lights and noise.",
    translation: "烟花",
    example: "We watched fireworks at midnight.",
    exampleTranslation: "我们在午夜看了烟花。",
  },
  relatives: {
    word: "relatives",
    pronunciation: "/ˈrel.ə.tɪvz/",
    partOfSpeech: "n.",
    definition: "Plural of 'relative': people in your family.",
    translation: "亲戚（复数）",
    example: "All my relatives came for the wedding.",
    exampleTranslation: "我所有的亲戚都来参加了婚礼。",
  },
  wishes: {
    word: "wishes",
    pronunciation: "/ˈwɪʃ.ɪz/",
    partOfSpeech: "n.",
    definition: "Plural of 'wish': things you hope will happen, or kind words you give to others.",
    translation: "愿望；祝福（复数）",
    example: "Best wishes on your birthday!",
    exampleTranslation: "祝你生日快乐！",
  },

  // famous people / Olympic
  olympic: {
    word: "Olympic",
    pronunciation: "/əˈlɪm.pɪk/",
    partOfSpeech: "adj.",
    definition: "Relating to the Olympic Games, the world's biggest sports event.",
    translation: "奥林匹克的",
    example: "She won an Olympic gold medal.",
    exampleTranslation: "她赢得了一块奥运金牌。",
  },
  ancient: {
    word: "ancient",
    pronunciation: "/ˈeɪn.ʃənt/",
    partOfSpeech: "adj.",
    definition: "Very old; from a long time ago.",
    translation: "古代的；古老的",
    example: "We learned about ancient Egypt today.",
    exampleTranslation: "我们今天学了古埃及的知识。",
  },
  greece: {
    word: "Greece",
    pronunciation: "/ɡriːs/",
    partOfSpeech: "n.",
    definition: "A country in southern Europe with a long history.",
    translation: "希腊",
    example: "Greece is famous for its ancient temples.",
    exampleTranslation: "希腊以它的古代神庙而闻名。",
  },
  allowed: {
    word: "allowed",
    pronunciation: "/əˈlaʊd/",
    partOfSpeech: "v.",
    definition: "Past form of 'allow': to let someone do something.",
    translation: "允许（过去式 / 过去分词）",
    example: "We are allowed to use the library after class.",
    exampleTranslation: "我们被允许下课后使用图书馆。",
  },
  races: {
    word: "races",
    pronunciation: "/ˈreɪ.sɪz/",
    partOfSpeech: "n.",
    definition: "Plural of 'race': competitions to see who is fastest.",
    translation: "比赛；赛跑（复数）",
    example: "He won three races today.",
    exampleTranslation: "他今天赢了三场比赛。",
  },
  competed: {
    word: "competed",
    pronunciation: "/kəmˈpiː.tɪd/",
    partOfSpeech: "v.",
    definition: "Past form of 'compete': to try to win in a sport or contest.",
    translation: "比赛；竞争（过去式）",
    example: "She competed against runners from many countries.",
    exampleTranslation: "她与来自许多国家的选手同场竞技。",
  },
  wrestling: {
    word: "wrestling",
    pronunciation: "/ˈres.lɪŋ/",
    partOfSpeech: "n.",
    definition: "A sport in which two people try to throw each other to the ground.",
    translation: "摔跤",
    example: "Wrestling is a very old sport.",
    exampleTranslation: "摔跤是一项非常古老的运动。",
  },
  centuries: {
    word: "centuries",
    pronunciation: "/ˈsen.tʃər.iz/",
    partOfSpeech: "n.",
    definition: "Plural of 'century': periods of one hundred years.",
    translation: "世纪（复数）",
    example: "This temple has stood for many centuries.",
    exampleTranslation: "这座庙宇已经矗立了许多个世纪。",
  },
  athletes: {
    word: "athletes",
    pronunciation: "/ˈæθ.liːts/",
    partOfSpeech: "n.",
    definition: "Plural of 'athlete': people who are very good at sports.",
    translation: "运动员（复数）",
    example: "The athletes trained every day.",
    exampleTranslation: "运动员们每天训练。",
  },
  remind: {
    word: "remind",
    pronunciation: "/rɪˈmaɪnd/",
    partOfSpeech: "v.",
    definition: "To help someone remember something.",
    translation: "提醒；使想起",
    example: "Please remind me to call her.",
    exampleTranslation: "请提醒我给她打电话。",
  },

  // young inventor
  inventor: {
    word: "inventor",
    pronunciation: "/ɪnˈven.tər/",
    partOfSpeech: "n.",
    definition: "A person who creates something new.",
    translation: "发明家",
    example: "Thomas Edison was a famous inventor.",
    exampleTranslation: "托马斯·爱迪生是一位著名的发明家。",
  },
  grandmother: {
    word: "grandmother",
    pronunciation: "/ˈɡræn.mʌð.ər/",
    partOfSpeech: "n.",
    definition: "The mother of your mother or father.",
    translation: "祖母；外祖母；奶奶；外婆",
    example: "My grandmother makes the best dumplings.",
    exampleTranslation: "我奶奶做的饺子最好吃。",
  },
  shake: {
    word: "shake",
    pronunciation: "/ʃeɪk/",
    partOfSpeech: "v.",
    definition: "To move quickly back and forth or up and down.",
    translation: "摇；颤抖",
    example: "Shake the bottle before opening it.",
    exampleTranslation: "打开瓶子前先摇一摇。",
  },
  ideas: {
    word: "ideas",
    pronunciation: "/aɪˈdiː.əz/",
    partOfSpeech: "n.",
    definition: "Plural of 'idea': thoughts or plans for what to do.",
    translation: "想法；点子（复数）",
    example: "She always has good ideas.",
    exampleTranslation: "她总是有好点子。",
  },
  cup: {
    word: "cup",
    pronunciation: "/kʌp/",
    partOfSpeech: "n.",
    definition: "A small open container used for drinking.",
    translation: "杯子",
    example: "Can I have a cup of tea, please?",
    exampleTranslation: "请给我一杯茶，好吗？",
  },
  handle: {
    word: "handle",
    pronunciation: "/ˈhæn.dəl/",
    partOfSpeech: "n.",
    definition: "The part of an object you hold with your hand.",
    translation: "把手",
    example: "The cup has a small handle on the side.",
    exampleTranslation: "杯子的一侧有一个小把手。",
  },
  fair: {
    word: "fair",
    pronunciation: "/fer/",
    partOfSpeech: "n.",
    definition: "An event where people show or sell things, like a science fair.",
    translation: "展览；集市",
    example: "There is a book fair this weekend.",
    exampleTranslation: "这个周末有个图书展。",
  },
  invention: {
    word: "invention",
    pronunciation: "/ɪnˈven.ʃən/",
    partOfSpeech: "n.",
    definition: "Something new that someone has created.",
    translation: "发明",
    example: "The light bulb is a famous invention.",
    exampleTranslation: "电灯泡是一项著名的发明。",
  },

  // robots
  robot: {
    word: "robot",
    pronunciation: "/ˈroʊ.bɒt/",
    partOfSpeech: "n.",
    definition: "A machine that can do work like a person.",
    translation: "机器人",
    example: "The robot can dance to music.",
    exampleTranslation: "这个机器人能跟着音乐跳舞。",
  },
  factories: {
    word: "factories",
    pronunciation: "/ˈfæk.tər.iz/",
    partOfSpeech: "n.",
    definition: "Plural of 'factory': big buildings where things are made.",
    translation: "工厂（复数）",
    example: "Many cars are made in big factories.",
    exampleTranslation: "很多汽车都是在大型工厂里生产的。",
  },
  metal: {
    word: "metal",
    pronunciation: "/ˈmet.əl/",
    partOfSpeech: "n.",
    definition: "A hard, shiny material like iron, gold, or silver.",
    translation: "金属",
    example: "The bridge is made of metal.",
    exampleTranslation: "这座桥是用金属做的。",
  },
  hospitals: {
    word: "hospitals",
    pronunciation: "/ˈhɒs.pɪ.təlz/",
    partOfSpeech: "n.",
    definition: "Plural of 'hospital': places where sick people get help from doctors.",
    translation: "医院（复数）",
    example: "Doctors and nurses work in hospitals.",
    exampleTranslation: "医生和护士在医院工作。",
  },
  medicine: {
    word: "medicine",
    pronunciation: "/ˈmed.ə.sən/",
    partOfSpeech: "n.",
    definition: "Something you take when you are sick to help you feel better.",
    translation: "药",
    example: "Take this medicine three times a day.",
    exampleTranslation: "这种药一天吃三次。",
  },
  patients: {
    word: "patients",
    pronunciation: "/ˈpeɪ.ʃənts/",
    partOfSpeech: "n.",
    definition: "Plural of 'patient': people who are getting medical care.",
    translation: "病人（复数）",
    example: "The doctor sees many patients each day.",
    exampleTranslation: "这位医生每天要看很多病人。",
  },
  operations: {
    word: "operations",
    pronunciation: "/ˌɒp.əˈreɪ.ʃənz/",
    partOfSpeech: "n.",
    definition: "Plural of 'operation': times when doctors cut and fix the body.",
    translation: "手术（复数）",
    example: "Doctors perform operations to save lives.",
    exampleTranslation: "医生通过手术来挽救生命。",
  },
  dangerous: {
    word: "dangerous",
    pronunciation: "/ˈdeɪn.dʒər.əs/",
    partOfSpeech: "adj.",
    definition: "Not safe; able to hurt someone.",
    translation: "危险的",
    example: "It is dangerous to play in the road.",
    exampleTranslation: "在马路上玩很危险。",
  },
  risky: {
    word: "risky",
    pronunciation: "/ˈrɪs.ki/",
    partOfSpeech: "adj.",
    definition: "Possibly causing harm or loss; dangerous.",
    translation: "冒险的；有风险的",
    example: "Climbing high mountains is risky.",
    exampleTranslation: "爬高山是有风险的。",
  },
  scientists: {
    word: "scientists",
    pronunciation: "/ˈsaɪ.ən.tɪsts/",
    partOfSpeech: "n.",
    definition: "Plural of 'scientist': people who study science.",
    translation: "科学家（复数）",
    example: "Scientists are studying the moon.",
    exampleTranslation: "科学家们正在研究月球。",
  },
  explore: {
    word: "explore",
    pronunciation: "/ɪkˈsplɔːr/",
    partOfSpeech: "v.",
    definition: "To travel to a new place to learn about it.",
    translation: "探索",
    example: "We want to explore the old castle.",
    exampleTranslation: "我们想去探索那座古城堡。",
  },
  ocean: {
    word: "ocean",
    pronunciation: "/ˈoʊ.ʃən/",
    partOfSpeech: "n.",
    definition: "A very large area of salty water that covers much of the Earth.",
    translation: "海洋",
    example: "The Pacific Ocean is the largest ocean.",
    exampleTranslation: "太平洋是最大的海洋。",
  },
  planets: {
    word: "planets",
    pronunciation: "/ˈplæn.ɪts/",
    partOfSpeech: "n.",
    definition: "Plural of 'planet': large round objects in space that move around a star.",
    translation: "行星（复数）",
    example: "There are eight planets in our solar system.",
    exampleTranslation: "我们的太阳系有八颗行星。",
  },
  technology: {
    word: "technology",
    pronunciation: "/tekˈnɒl.ə.dʒi/",
    partOfSpeech: "n.",
    definition: "The use of scientific knowledge for practical things.",
    translation: "科技；技术",
    example: "Technology is changing how we learn.",
    exampleTranslation: "科技正在改变我们的学习方式。",
  },
  future: {
    word: "future",
    pronunciation: "/ˈfjuː.tʃər/",
    partOfSpeech: "n.",
    definition: "The time that has not come yet.",
    translation: "未来",
    example: "What do you want to be in the future?",
    exampleTranslation: "你将来想做什么？",
  },
};

export function getArticle(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function lookupWord(raw: string, locale: Locale = defaultLocale): WordEntry {
  const key = raw.toLowerCase().replace(/[^a-z']/g, "");
  const found = dictionary[key];
  if (found) return found;
  const t = getDict(locale);
  return {
    word: raw,
    pronunciation: "—",
    partOfSpeech: "—",
    definition: t.panel.noEntry,
    translation: locale === "zh" ? "暂无释义" : "No translation yet",
    example: "—",
    exampleTranslation: "—",
  };
}
