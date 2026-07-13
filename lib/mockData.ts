import type { Article, Topic, WeeklyStory, WordEntry } from "./types";
import { defaultLocale, getDict, type Locale } from "./i18n";
import { weeklyDictionary } from "./weeklyDictionary";

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
        word: "nervous",
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
      {
        id: "q7",
        type: "vocabulary",
        word: "excited",
        question:
          "Lily came home feeling 'excited'. What does 'excited' mean?",
        options: [
          "Feeling sleepy and slow",
          "Feeling very happy and full of energy",
          "Feeling afraid of the dark",
          "Feeling hungry",
        ],
        correctAnswer: "Feeling very happy and full of energy",
        explanation:
          "Lily felt happy and excited about tomorrow — full of happy energy for the next day.",
      },
      {
        id: "q8",
        type: "vocabulary",
        word: "promised",
        question: "\"We promised to be friends.\" What does 'promise' mean?",
        options: [
          "To forget something",
          "To ask a question",
          "To say you will surely do something",
          "To walk home",
        ],
        correctAnswer: "To say you will surely do something",
        explanation:
          "When you promise something, you say you will surely do it — Lily and Mia said they would surely be friends.",
      },
      {
        id: "q9",
        type: "grammar",
        question:
          "\"My classmates asked me where I was from.\" Why is it 'where I was from' and not 'where was I from'?",
        options: [
          "Object clauses use statement word order",
          "It is a spelling mistake",
          "Questions never use 'where'",
          "Because 'I' always comes last",
        ],
        correctAnswer: "Object clauses use statement word order",
        explanation:
          "Inside a reported question (an object clause), we use statement order: asked me where I was from, not where was I from.",
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
        word: "trunk",
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
      {
        id: "q6",
        type: "vocabulary",
        word: "lift",
        question: "\"It can lift heavy logs.\" What does 'lift' mean?",
        options: [
          "To raise something up",
          "To eat something",
          "To hide something",
          "To wash something",
        ],
        correctAnswer: "To raise something up",
        explanation:
          "To lift means to raise something up — the trunk raises heavy logs off the ground.",
      },
      {
        id: "q7",
        type: "vocabulary",
        word: "greet",
        question:
          "Elephants use their trunks to 'greet' friends. What does 'greet' mean?",
        options: [
          "To run away from someone",
          "To feed someone",
          "To push someone",
          "To say hello to someone",
        ],
        correctAnswer: "To say hello to someone",
        explanation:
          "To greet someone is to say hello — elephants touch trunks to say hello to their friends.",
      },
      {
        id: "q8",
        type: "detail",
        question:
          "How long does a baby elephant practice to learn to control its trunk?",
        options: [
          "For one day",
          "For months",
          "For an hour",
          "It never needs to practice",
        ],
        correctAnswer: "For months",
        explanation:
          "The article says a baby elephant has to practice for months to control its trunk.",
      },
      {
        id: "q9",
        type: "grammar",
        question:
          "\"Elephants use their trunks to drink water.\" What does 'to drink' tell us?",
        options: [
          "The past time of the action",
          "That it is a question",
          "That there is more than one elephant",
          "The purpose — why they use their trunks",
        ],
        correctAnswer: "The purpose — why they use their trunks",
        explanation:
          "'use something to do something' — the to-verb explains the purpose: why the trunk is used.",
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
        word: "tilts",
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
      {
        id: "q6",
        type: "vocabulary",
        word: "sunshine",
        question: "What is 'sunshine'?",
        options: [
          "A kind of rain",
          "The name of a season",
          "The light and warmth from the sun",
          "A strong wind",
        ],
        correctAnswer: "The light and warmth from the sun",
        explanation:
          "In summer the sunshine — the sun's light and warmth — feels strong and warm.",
      },
      {
        id: "q7",
        type: "vocabulary",
        word: "wondered",
        question:
          "\"Have you ever wondered why we have seasons?\" What does 'wonder' mean here?",
        options: [
          "To ask yourself a question about something",
          "To be angry about something",
          "To draw a picture of something",
          "To travel to a place",
        ],
        correctAnswer: "To ask yourself a question about something",
        explanation:
          "When you wonder about something, you feel curious and ask yourself a question about it.",
      },
      {
        id: "q8",
        type: "detail",
        question: "What happens six months after summer where you live?",
        options: [
          "Earth stops moving",
          "The sun becomes bigger",
          "Your part of Earth gets closer to the sun",
          "Your part of Earth tilts away from the sun",
        ],
        correctAnswer: "Your part of Earth tilts away from the sun",
        explanation:
          "The article says: six months later, your part of Earth tilts away from the sun — and that brings winter.",
      },
      {
        id: "q9",
        type: "grammar",
        question:
          "\"The seasons are caused by the way Earth tilts.\" What form is 'are caused'?",
        options: [
          "Simple past tense",
          "Passive voice — something causes the seasons",
          "A command",
          "Future tense",
        ],
        correctAnswer: "Passive voice — something causes the seasons",
        explanation:
          "'be + past participle' (are caused) is the passive voice: the seasons don't act — they are caused by Earth's tilt.",
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
        word: "habits",
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
      {
        id: "q4",
        type: "tense",
        question: "\"Every morning, he wakes up early.\" What tense is 'wakes'?",
        options: [
          "Simple present",
          "Simple past",
          "Future",
          "Present continuous",
        ],
        correctAnswer: "Simple present",
        explanation:
          "Grandfather does this every morning, so it is a habit. Habits use the simple present, adding -s for he/she/it (wake → wakes).",
      },
      {
        id: "q5",
        type: "singular_plural",
        question:
          "Grandfather drinks one glass of water. If he drinks two, they are two ___?",
        options: ["glasses", "glass", "glasss", "glassies"],
        correctAnswer: "glasses",
        explanation:
          "Nouns ending in -s, -ss, -sh, or -ch add -es in the plural: one glass → two glasses.",
      },
      {
        id: "q6",
        type: "vocabulary",
        word: "healthy",
        question: "What does 'healthy' mean?",
        options: [
          "In good physical or mental condition",
          "Very rich",
          "Very tall",
          "Always sleepy",
        ],
        correctAnswer: "In good physical or mental condition",
        explanation:
          "Grandfather is seventy but still healthy — his body is in good condition.",
      },
      {
        id: "q7",
        type: "vocabulary",
        word: "instead",
        question:
          "\"He reads a book instead of watching his phone.\" What does 'instead of' mean?",
        options: [
          "Together with something else",
          "In the place of something else",
          "After something else",
          "Because of something else",
        ],
        correctAnswer: "In the place of something else",
        explanation:
          "'Instead of' means in the place of — he chooses a book, not the phone.",
      },
      {
        id: "q8",
        type: "detail",
        question: "What does Grandfather do in the afternoon?",
        options: [
          "He watches TV alone",
          "He goes swimming",
          "He plays table tennis with his friends",
          "He takes a long nap",
        ],
        correctAnswer: "He plays table tennis with his friends",
        explanation:
          "The article says: in the afternoon, he plays table tennis with his friends.",
      },
      {
        id: "q9",
        type: "grammar",
        question:
          "\"He never skips meals.\" Where does a word like 'never' usually go?",
        options: [
          "At the very end of the sentence",
          "Before the subject: Never he skips meals",
          "Before the main verb: He never skips meals",
          "Anywhere — it doesn't matter",
        ],
        correctAnswer: "Before the main verb: He never skips meals",
        explanation:
          "Frequency adverbs like never, always, and often usually go before the main verb.",
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
        word: "gathers",
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
      {
        id: "q4",
        type: "vocabulary",
        word: "relatives",
        question:
          "\"We visit relatives and share good wishes.\" Who are 'relatives'?",
        options: [
          "People who live far away",
          "People in your family",
          "People you have never met",
          "People who sell food",
        ],
        correctAnswer: "People in your family",
        explanation:
          "Relatives are people in your family — like uncles, aunts, and cousins.",
      },
      {
        id: "q5",
        type: "vocabulary",
        word: "decorations",
        question: "What are 'decorations'?",
        options: [
          "Pretty things used to make a place look nice",
          "Different kinds of food",
          "Games played at festivals",
          "Kinds of money",
        ],
        correctAnswer: "Pretty things used to make a place look nice",
        explanation:
          "The red paper decorations make the doors and windows look nice for the festival.",
      },
      {
        id: "q6",
        type: "detail",
        question: "When does the whole family gather for a big dinner?",
        options: [
          "At lunchtime on any day",
          "A week after the festival",
          "On New Year's Eve",
          "On the first day of school",
        ],
        correctAnswer: "On New Year's Eve",
        explanation:
          "The article says: on New Year's Eve, my whole family gathers for a big dinner together.",
      },
      {
        id: "q7",
        type: "tense",
        question:
          "\"A few days before the festival, my mom and I clean every corner.\" What tense is 'clean'?",
        options: [
          "Simple past",
          "Future",
          "Present continuous",
          "Simple present",
        ],
        correctAnswer: "Simple present",
        explanation:
          "This happens every year before the festival — repeated actions use the simple present tense.",
      },
      {
        id: "q8",
        type: "singular_plural",
        question:
          "Grandparents give one red envelope each. Together they give many red ___?",
        options: ["envelopes", "envelope", "envelopies", "envelopeses"],
        correctAnswer: "envelopes",
        explanation:
          "Most nouns add -s in the plural: one envelope → many envelopes.",
      },
      {
        id: "q9",
        type: "grammar",
        question:
          "\"We clean every corner of our home.\" Which is correct after 'every'?",
        options: [
          "A plural noun: every corners",
          "A singular noun: every corner",
          "An -ing verb: every cleaning",
          "An adverb: every quickly",
        ],
        correctAnswer: "A singular noun: every corner",
        explanation:
          "When 'every' comes right before a countable noun, that noun is singular: every corner, every day, every student.",
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
        word: "ancient",
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
      {
        id: "q4",
        type: "vocabulary",
        word: "athletes",
        question: "Who are 'athletes'?",
        options: [
          "People who write books",
          "People who train for and take part in sports",
          "People who cook food",
          "People who build houses",
        ],
        correctAnswer: "People who train for and take part in sports",
        explanation:
          "Athletes train for and take part in sports — today they come from almost every country to compete.",
      },
      {
        id: "q5",
        type: "vocabulary",
        word: "centuries",
        question:
          "\"After many centuries, the games were stopped.\" What is a 'century'?",
        options: [
          "A period of ten days",
          "A period of one hundred years",
          "A kind of race",
          "A large stadium",
        ],
        correctAnswer: "A period of one hundred years",
        explanation:
          "One century is one hundred years, so 'many centuries' means many hundreds of years.",
      },
      {
        id: "q6",
        type: "detail",
        question: "How often do athletes come together to compete today?",
        options: [
          "Every year",
          "Every month",
          "Every ten years",
          "Every four years",
        ],
        correctAnswer: "Every four years",
        explanation:
          "The article says athletes come together to compete every four years.",
      },
      {
        id: "q7",
        type: "tense",
        question:
          "\"They started more than two thousand years ago.\" What tense is 'started'?",
        options: [
          "Simple present",
          "Simple past",
          "Future",
          "Present perfect",
        ],
        correctAnswer: "Simple past",
        explanation:
          "'started' is the past form, and 'ago' is a signal word for the simple past.",
      },
      {
        id: "q8",
        type: "grammar",
        question:
          "\"Only Greek men were allowed to take part.\" What form is 'were allowed'?",
        options: [
          "A question",
          "Passive voice — they received permission",
          "Future tense",
          "A command",
        ],
        correctAnswer: "Passive voice — they received permission",
        explanation:
          "'be + past participle' (were allowed) is the passive voice: someone gave them permission.",
      },
      {
        id: "q9",
        type: "comparative",
        question:
          "\"The Olympic Games are the biggest sports event in the world.\" What form is 'biggest'?",
        options: [
          "Comparative — comparing two things",
          "Simple past",
          "Plural",
          "Superlative — comparing one thing with all others",
        ],
        correctAnswer: "Superlative — comparing one thing with all others",
        explanation:
          "big → bigger → biggest. 'The biggest ... in the world' compares the games with all other events.",
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
        word: "inventor",
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
      {
        id: "q4",
        type: "vocabulary",
        word: "invention",
        question: "What is an 'invention'?",
        options: [
          "A kind of school test",
          "An old story",
          "Something new that someone has created",
          "A place to buy cups",
        ],
        correctAnswer: "Something new that someone has created",
        explanation:
          "Tom's cup is an invention — a new thing that he created himself.",
      },
      {
        id: "q5",
        type: "vocabulary",
        word: "shake",
        question:
          "\"His grandmother's hands shake when she drinks.\" What does 'shake' mean?",
        options: [
          "To move quickly back and forth",
          "To stay very still",
          "To grow bigger",
          "To feel warm",
        ],
        correctAnswer: "To move quickly back and forth",
        explanation:
          "Her hands move back and forth without stopping — that is what 'shake' means.",
      },
      {
        id: "q6",
        type: "detail",
        question: "What did Tom use to make the first cup?",
        options: [
          "New parts from a shop",
          "Old toy parts and bottle caps",
          "Paper and glue",
          "His father's tools only",
        ],
        correctAnswer: "Old toy parts and bottle caps",
        explanation:
          "The article says he used some old toy parts and bottle caps to make the first one.",
      },
      {
        id: "q7",
        type: "tense",
        question: "\"Tom built a special cup.\" What is 'built'?",
        options: [
          "The -ing form of 'build'",
          "The irregular past form of 'build'",
          "A noun meaning 'building'",
          "The future form of 'build'",
        ],
        correctAnswer: "The irregular past form of 'build'",
        explanation:
          "'build' is an irregular verb: build → built (not 'builded').",
      },
      {
        id: "q8",
        type: "grammar",
        question:
          "\"He saw his grandmother's hands shake.\" After 'see + somebody/something', what is the difference between 'shake' and 'shaking'?",
        options: [
          "There is no difference at all",
          "'shake' shows the whole action; 'shaking' would show it in progress",
          "'shake' is future tense and 'shaking' is past tense",
          "'shaking' can never be used after 'see'",
        ],
        correctAnswer:
          "'shake' shows the whole action; 'shaking' would show it in progress",
        explanation:
          "Both are grammatical: 'see + object + base verb' (shake) presents the whole action as a complete event, while 'see + object + verb-ing' (shaking) would describe the action in progress.",
      },
      {
        id: "q9",
        type: "singular_plural",
        question: "Tom thought of one idea, then more. He had many good ___?",
        options: ["ideas", "idea", "ideaes", "idea's"],
        correctAnswer: "ideas",
        explanation:
          "Most nouns add -s in the plural: one idea → many ideas.",
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
        word: "risky",
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
      {
        id: "q4",
        type: "vocabulary",
        word: "explore",
        question: "What does 'explore' mean?",
        options: [
          "To travel to a new place to learn about it",
          "To break something into pieces",
          "To stay at home",
          "To repeat something many times",
        ],
        correctAnswer: "To travel to a new place to learn about it",
        explanation:
          "Robots explore the deep ocean and other planets — they go there to learn about them.",
      },
      {
        id: "q5",
        type: "vocabulary",
        word: "patients",
        question: "In a hospital, who are the 'patients'?",
        options: [
          "People who clean the rooms",
          "People who visit on weekends",
          "People who are getting medical care",
          "People who fix machines",
        ],
        correctAnswer: "People who are getting medical care",
        explanation:
          "Patients are the people receiving medical care in a hospital — robots carry medicine to them.",
      },
      {
        id: "q6",
        type: "detail",
        question: "What can small round robots do at home?",
        options: [
          "Cook dinner",
          "Clean the floor by themselves",
          "Do your homework",
          "Wash the windows",
        ],
        correctAnswer: "Clean the floor by themselves",
        explanation:
          "The article says: at home, small round robots can clean the floor by themselves.",
      },
      {
        id: "q7",
        type: "singular_plural",
        question:
          "'Factories' is the plural of 'factory'. How do nouns ending in consonant + y form the plural?",
        options: [
          "Just add -s: factorys",
          "Add -es after y: factoryes",
          "They stay the same",
          "Change -y to -ies: factory → factories",
        ],
        correctAnswer: "Change -y to -ies: factory → factories",
        explanation:
          "When a noun ends in a consonant + y, change the y to -ies: factory → factories, baby → babies.",
      },
      {
        id: "q8",
        type: "tense",
        question:
          "\"Scientists are building robots that can explore the deep ocean.\" What tense is 'are building'?",
        options: [
          "Simple past",
          "Simple present",
          "Present continuous",
          "Future",
        ],
        correctAnswer: "Present continuous",
        explanation:
          "'be + verb-ing' (are building) is the present continuous — the work is happening now.",
      },
      {
        id: "q9",
        type: "grammar",
        question:
          "\"Robots can do work that is too risky for humans.\" What does 'that is too risky for humans' do?",
        options: [
          "It describes which work — like an adjective for 'work'",
          "It shows the work happened long ago",
          "It turns the sentence into a question",
          "It gives a command",
        ],
        correctAnswer:
          "It describes which work — like an adjective for 'work'",
        explanation:
          "'that is too risky for humans' is a relative clause — it tells us exactly which work robots do.",
      },
    ],
  },

  // ── Weekly Stories track (每周小故事) ──────────────────────────────
  // Original graded retellings inspired by the weekly source stories, kept
  // copyright-safe for public deployment (no verbatim source prose).
  {
    id: "weekly-1-friendship",
    topicId: "weekly-stories",
    track: "weekly-stories",
    weekNumber: 1,
    title: "The Power of Friendship",
    chineseTitle: "友谊的力量",
    subtitle:
      "A nervous dancer, a failed exam, and a friend who would not let her give up.",
    focus: {
      zh: "友谊与坚持：用鼓励战胜想放弃的心情。",
      en: "Friendship & persistence: encouragement beats the urge to give up.",
    },
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "Laura, a classmate of mine, is so generous that she helps anyone who asks.",
        translation: "我的同学劳拉非常大方，谁向她求助她都会帮。",
        grammar:
          "'so ... that ...' 表示「如此……以至于」。'who asks' 是定语从句，修饰 anyone。",
      },
      {
        id: "s2",
        text: "The two of us share one hobby: we are both fond of dancing ballet.",
        translation: "我们俩有一个共同的爱好：都喜欢跳芭蕾。",
        grammar:
          "冒号引出具体内容。'be fond of (doing) sth' 意为「喜爱（做）某事」，of 后接名词或动名词。",
      },
      {
        id: "s3",
        text: "On the morning of my first dance exam, my hands were shaking — I felt nervous and anxious.",
        translation: "第一次舞蹈考试那天早上，我的手一直发抖——我感到紧张又焦虑。",
        grammar: "破折号用于补充说明。'feel + 形容词' 描述感受。",
      },
      {
        id: "s4",
        text: "I lost count of my mistakes that day, and in the end I did not pass.",
        translation: "那天我数不清自己犯了多少错，最后没能通过。",
        grammar:
          "一般过去时 'lost / did not pass' 叙述已经发生的事。'lose count of' 意为「数不清」。",
      },
      {
        id: "s5",
        text: "Such a disappointing result left me feeling embarrassed, and a small voice inside kept telling me to quit.",
        translation: "这么令人失望的结果让我感到难堪，心里有个小声音一直叫我放弃。",
        grammar: "'leave sb doing sth' 表示「使某人一直处于某种状态」。",
      },
      {
        id: "s6",
        text: "But when I finally opened up to Laura, she did not laugh — she just listened.",
        translation: "可当我终于向劳拉敞开心扉时，她没有笑话我——只是静静地听。",
        grammar: "'open up to sb' 意为「向某人敞开心扉」。破折号引出补充说明。",
      },
      {
        id: "s7",
        text: "\"Quitting now is something you'll regret,\" she told me gently, pulling me into a hug.",
        translation: "「现在放弃，你会后悔的，」她轻声对我说，把我拉进怀里抱住。",
        grammar:
          "'something you'll regret' 中 you'll regret 是省略 that 的定语从句。'pulling...' 是现在分词作伴随状语。",
      },
      {
        id: "s8",
        text: "Later she gave me a little present to comfort me: brand-new ballet shoes and a short handwritten note.",
        translation: "后来她送了我一份小礼物来安慰我：一双崭新的芭蕾舞鞋和一张手写的小便条。",
        grammar: "不定式 'to comfort me' 表目的。冒号引出礼物的具体内容。",
      },
      {
        id: "s9",
        text: "Reading her warm words, I slowly grew calm and confident again.",
        translation: "读着她暖心的话，我慢慢平静下来，也重新找回了自信。",
        grammar: "'Reading...' 现在分词短语作状语，表示伴随动作。'grow + 形容词' 表示「逐渐变得」。",
      },
      {
        id: "s10",
        text: "Knowing I had such a reliable friend to encourage me, I gathered the courage to step onto the stage once more — and this time I passed.",
        translation:
          "知道自己有这样一位可靠的朋友鼓励我，我鼓起勇气再次走上舞台——这一次我通过了。",
        grammar:
          "'Knowing...' 现在分词作状语。'gather the courage to do sth' 意为「鼓起勇气做某事」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        word: "nervous",
        question: "In the story, what does 'nervous' mean?",
        options: [
          "Worried and a little afraid",
          "Very happy",
          "Extremely tired",
          "Angry",
        ],
        correctAnswer: "Worried and a little afraid",
        explanation:
          "Before the exam she felt nervous and anxious — worried and a little afraid.",
      },
      {
        id: "q2",
        type: "detail",
        question: "Why did the narrator fail the first exam?",
        options: [
          "She made many mistakes",
          "She arrived too late",
          "She forgot her shoes",
          "She was sick that day",
        ],
        correctAnswer: "She made many mistakes",
        explanation:
          "The story says she lost count of her mistakes that day and did not pass.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "What is the story mainly about?",
        options: [
          "A friend's encouragement helps her not give up",
          "How to buy ballet shoes",
          "Why exams are unfair",
          "How to dance ballet perfectly",
        ],
        correctAnswer: "A friend's encouragement helps her not give up",
        explanation:
          "Laura comforts and encourages her until she finds the courage to try again.",
      },
      {
        id: "q4",
        type: "tense",
        question:
          "\"I lost count of my mistakes that day, and in the end I did not pass.\" What tense is used?",
        options: [
          "Simple past",
          "Simple present",
          "Future",
          "Present continuous",
        ],
        correctAnswer: "Simple past",
        explanation:
          "'lost' and 'did not pass' are past forms — the events already happened.",
      },
      {
        id: "q5",
        type: "vocabulary",
        word: "fond",
        question:
          "\"We are both fond of dancing ballet.\" What does 'be fond of' mean?",
        options: [
          "To like something very much",
          "To be afraid of something",
          "To be tired of something",
          "To forget something",
        ],
        correctAnswer: "To like something very much",
        explanation:
          "'be fond of' is a set phrase meaning to like or love something.",
      },
      {
        id: "q6",
        type: "vocabulary",
        word: "reliable",
        question:
          "She calls Laura a 'reliable' friend. What does 'reliable' mean?",
        options: [
          "Able to be trusted or depended on",
          "Very rich",
          "Hard to find",
          "Funny and loud",
        ],
        correctAnswer: "Able to be trusted or depended on",
        explanation:
          "A reliable friend is one you can trust and depend on — Laura is always there to help.",
      },
      {
        id: "q7",
        type: "detail",
        question: "What present did Laura give to comfort the narrator?",
        options: [
          "A box of chocolates",
          "Brand-new ballet shoes and a handwritten note",
          "A dance video",
          "A new dress",
        ],
        correctAnswer: "Brand-new ballet shoes and a handwritten note",
        explanation:
          "The story says the little present was brand-new ballet shoes and a short handwritten note.",
      },
      {
        id: "q8",
        type: "grammar",
        question:
          "\"Laura is so generous that she helps anyone who asks.\" What does 'so ... that ...' show?",
        options: [
          "A question about Laura",
          "Something that happened long ago",
          "A result — she is so generous that she helps anyone who asks",
          "A place where Laura helps",
        ],
        correctAnswer:
          "A result — she is so generous that she helps anyone who asks",
        explanation:
          "'so + adjective + that ...' links a strong quality to its result: she is so generous that the result follows — she helps anyone who asks her.",
      },
      {
        id: "q9",
        type: "tense",
        question:
          "\"On the morning of the exam, my hands were shaking.\" What does 'were shaking' describe?",
        options: [
          "A habit she still has now",
          "An action in progress at that past moment",
          "A future plan",
          "A command",
        ],
        correctAnswer: "An action in progress at that past moment",
        explanation:
          "'was/were + verb-ing' is the past continuous — her hands were shaking right at that moment in the past.",
      },
    ],
  },
  {
    id: "weekly-2-stupid-mistake",
    topicId: "weekly-stories",
    track: "weekly-stories",
    weekNumber: 2,
    title: "A Stupid Mistake",
    chineseTitle: "一个愚蠢的错误",
    subtitle:
      "A homeless cat, a bossy brother, and a lesson about caring for animals.",
    focus: {
      zh: "善待动物 · 不要想当然行事。",
      en: "Caring for animals and not acting carelessly.",
    },
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "Everybody makes mistakes — yes, even the cleverest people you know.",
        translation: "每个人都会犯错——是的，连你认识的最聪明的人也会。",
        grammar:
          "'Everybody' 作主语视为单数，谓语用第三人称单数 'makes'。破折号用于补充强调。",
      },
      {
        id: "s2",
        text: "Take my elder brother George: top of his class, yet he often forgets the most basic common sense.",
        translation: "就拿我哥哥乔治来说：班里第一名，却常常忘记最基本的常识。",
        grammar:
          "'Take ... :' 用来举例，「拿……来说」。'yet' 表示转折，「却」。",
      },
      {
        id: "s3",
        text: "One morning a thin, homeless cat wandered onto our balcony and surprised us all.",
        translation: "一天早上，一只瘦瘦的流浪猫溜进了我们的阳台，把大家都吓了一跳。",
        grammar: "形容词 'thin, homeless' 并列修饰 cat。'wander onto' 意为「溜达到……上」。",
      },
      {
        id: "s4",
        text: "Our smiles faded the moment we realised it had swallowed our pet goldfish — we were really annoyed.",
        translation: "可当我们发现它把我们的宠物金鱼吞掉时，笑容立刻消失了——我们非常恼火。",
        grammar:
          "'the moment...' 引导时间状语从句，「一……就……」。'had swallowed' 是过去完成时。",
      },
      {
        id: "s5",
        text: "Before long the cat started shaking all over, and we were completely confused, with no idea how to help.",
        translation: "没过多久，猫开始浑身发抖，我们彻底懵了，不知道该怎么帮它。",
        grammar:
          "'Before long' 意为「不久」。'be confused' 意为「感到困惑」；'with no idea how to...' 补充说明。",
      },
      {
        id: "s6",
        text: "\"A cold, obviously. Just feed it some cold medicine,\" my bossy brother announced, as if he were a doctor.",
        translation: "「显然是感冒了。喂点感冒药就行，」我那爱发号施令的哥哥宣布道，仿佛他是个医生。",
        grammar: "'as if + 虚拟语气'（were）表示与事实相反的假设。",
      },
      {
        id: "s7",
        text: "Minutes later came the frightening part: no matter what we did, the cat simply would not wake up.",
        translation: "几分钟后，可怕的事情来了：不管我们怎么做，猫就是醒不过来。",
        grammar:
          "'no matter what...' 引导让步状语从句。'would not' 表示「怎么也不……」。",
      },
      {
        id: "s8",
        text: "Feeling ashamed of our foolish choice, we rushed the cat to the animal hospital.",
        translation: "我们为自己愚蠢的决定感到惭愧，急忙把猫送到了动物医院。",
        grammar: "'Feeling ashamed...' 现在分词短语作状语，表示原因。",
      },
      {
        id: "s9",
        text: "A gentle vet worked hard and saved the cat, and at last we felt relieved.",
        translation: "一位温柔的兽医尽力救活了那只猫，我们终于松了一口气。",
        grammar: "并列句用 and 连接。'feel relieved' 意为「感到宽慰」。",
      },
      {
        id: "s10",
        text: "Happily, we decided to keep the cat and look after it ourselves.",
        translation: "我们高高兴兴地决定把猫留下来，亲自照顾它。",
        grammar: "副词 'Happily' 修饰整句。'look after' 意为「照顾」，'ourselves' 是反身代词。",
      },
      {
        id: "s11",
        text: "Now whenever I tell this story, I hope it inspires people to care for animals wisely — and never act without thinking.",
        translation: "现在每当我讲起这个故事，我都希望它能激励大家明智地爱护动物——永远不要不经思考就行动。",
        grammar:
          "'whenever' 引导时间状语从句。'inspire sb to do sth' 意为「激励某人做某事」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        word: "annoyed",
        question: "What does 'annoyed' mean?",
        options: ["Slightly angry", "Very happy", "Very tired", "Hungry"],
        correctAnswer: "Slightly angry",
        explanation:
          "They felt annoyed — slightly angry — when the cat ate their goldfish.",
      },
      {
        id: "q2",
        type: "detail",
        question: "Why did the cat stop waking up?",
        options: [
          "They gave it cold medicine by mistake",
          "It was very old",
          "It ran away",
          "It was only sleeping",
        ],
        correctAnswer: "They gave it cold medicine by mistake",
        explanation:
          "After the brother told them to give it cold medicine, the cat would not wake up.",
      },
      {
        id: "q3",
        type: "detail",
        question: "Where did they first find the cat?",
        options: ["On the balcony", "In the kitchen", "At school", "In the garden"],
        correctAnswer: "On the balcony",
        explanation: "They were amazed to find a homeless cat on their balcony.",
      },
      {
        id: "q4",
        type: "main_idea",
        question: "What lesson does the story teach?",
        options: [
          "Protect animals in the right way and don't act carelessly",
          "Cats make bad pets",
          "Smart people never make mistakes",
          "Older brothers are always right",
        ],
        correctAnswer:
          "Protect animals in the right way and don't act carelessly",
        explanation:
          "The narrator ends by asking everyone to care for animals properly.",
      },
      {
        id: "q5",
        type: "grammar",
        question:
          "\"Everybody makes mistakes.\" Why does 'make' take an -s here?",
        options: [
          "Because 'everybody' is treated as third-person singular",
          "Because it is past tense",
          "Because it is plural",
          "Because it is a question",
        ],
        correctAnswer:
          "Because 'everybody' is treated as third-person singular",
        explanation:
          "Indefinite pronouns like 'everybody' are singular, so the verb adds -s.",
      },
      {
        id: "q6",
        type: "vocabulary",
        word: "sense",
        question: "What does 'common sense' mean?",
        options: [
          "The ability to make good, sensible decisions",
          "A kind of money",
          "A school subject",
          "A type of cold",
        ],
        correctAnswer: "The ability to make good, sensible decisions",
        explanation:
          "George studies well but sometimes lacks common sense — good, practical judgement.",
      },
      {
        id: "q7",
        type: "vocabulary",
        word: "ashamed",
        question:
          "\"Feeling ashamed of our foolish choice...\" What does 'ashamed' mean?",
        options: [
          "Feeling proud of yourself",
          "Feeling bad or sorry about something you did",
          "Feeling sleepy",
          "Feeling hungry",
        ],
        correctAnswer: "Feeling bad or sorry about something you did",
        explanation:
          "They felt ashamed — bad and sorry — because their foolish choice hurt the cat.",
      },
      {
        id: "q8",
        type: "tense",
        question:
          "\"We realised it had swallowed our pet goldfish.\" Why 'had swallowed'?",
        options: [
          "The swallowing is happening right now",
          "The swallowing will happen soon",
          "The cat never swallowed the fish",
          "The swallowing happened before they realised it",
        ],
        correctAnswer: "The swallowing happened before they realised it",
        explanation:
          "'had + past participle' is the past perfect — the earlier of two past actions: first it swallowed, then they realised.",
      },
      {
        id: "q9",
        type: "grammar",
        question:
          "\"... as if he were a doctor.\" Why can 'were' be used here, even though the subject is 'he'?",
        options: [
          "Because 'he' is plural here",
          "Because the sentence is a question",
          "'as if + were' shows something that is not true — he is not a doctor",
          "Because the story happens in the future",
        ],
        correctAnswer:
          "'as if + were' shows something that is not true — he is not a doctor",
        explanation:
          "After 'as if', careful English uses 'were' for all persons to mark an unreal situation — the brother only acted like a doctor. (In informal English you may also hear 'was'; 'were' is the classic subjunctive choice.)",
      },
    ],
  },
  {
    id: "weekly-3-digital-watch",
    topicId: "weekly-stories",
    track: "weekly-stories",
    weekNumber: 3,
    title: "A Digital Watch",
    chineseTitle: "一块电子表",
    subtitle: "London weather is hard to trust — could a smart watch help?",
    focus: {
      zh: "天气与科技：用科技应对多变的天气。",
      en: "Weather & technology: using tech to handle changing weather.",
    },
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "For more than a year now, my cousin has lived in London, and she still cannot get used to its weather.",
        translation: "我表姐在伦敦已经住了一年多，却仍然适应不了那里的天气。",
        grammar:
          "现在完成时 'has lived' 表示从过去持续到现在。'get used to sth' 意为「适应」。",
      },
      {
        id: "s2",
        text: "What bothers her most is the damp, humid air and a weather forecast she can never trust.",
        translation: "最让她烦恼的是那潮湿的空气，还有一个她永远无法信任的天气预报。",
        grammar:
          "'What bothers her most' 是主语从句。'she can never trust' 是定语从句，修饰 forecast。",
      },
      {
        id: "s3",
        text: "In a single day, she says, the temperature can fall fast, swinging from a mild breeze to a freezing wind.",
        translation: "她说，在同一天里气温就可能骤降，从温和的微风变成刺骨的寒风。",
        grammar: "'swinging from A to B' 是现在分词短语，描述变化。'mild / freezing' 形容天气。",
      },
      {
        id: "s4",
        text: "During a video call last week, she told me about a clever gadget called a digital watch.",
        translation: "上周视频通话时，她跟我说起一个叫「电子表」的聪明小玩意儿。",
        grammar:
          "'During...' 介词短语作时间状语。过去分词 'called a digital watch' 作后置定语。",
      },
      {
        id: "s5",
        text: "\"My job sends me all over the place, and the weather can really affect my plans,\" she explained.",
        translation: "「我的工作要去很多地方，天气真的会影响我的计划，」她解释道。",
        grammar: "'send sb somewhere' 表示「派某人去某处」。'affect' 是及物动词，「影响」。",
      },
      {
        id: "s6",
        text: "She said the watch could tell her the weather anywhere she went, helping her make wise choices.",
        translation: "她说这块表无论她走到哪里都能告诉她天气，帮她做出明智的选择。",
        grammar:
          "间接引语中 can → could。'anywhere she went' 引导地点状语从句。'helping...' 现在分词作结果状语。",
      },
      {
        id: "s7",
        text: "It can even warn you to carry an umbrella and predict which hours of tomorrow will be sunny.",
        translation: "它甚至能提醒你带伞，还能预测明天哪几个时段会是晴天。",
        grammar: "'warn sb to do sth' 意为「提醒某人做某事」。'which hours...' 引导宾语从句。",
      },
      {
        id: "s8",
        text: "\"It can't be cheap,\" I said, \"but a watch like that truly deserves its price.\"",
        translation: "「这肯定不便宜，」我说，「不过这样一块表确实值这个价。」",
        grammar: "'can't be' 表示否定推测，「肯定不」。'deserve' 意为「值得」。",
      },
      {
        id: "s9",
        text: "Then she shared the best news: the watch was on sale that weekend, with a discount if you bought two.",
        translation: "接着她说出了最棒的消息：那块表周末打折，而且买两块还有优惠。",
        grammar: "冒号引出具体内容。'with a discount if...' 补充说明条件。",
      },
      {
        id: "s10",
        text: "\"Count me in — let's get one each!\" I said, but she had a small problem.",
        translation: "「算我一个——咱们一人买一块吧！」我说，但她遇到了点小麻烦。",
        grammar: "'Count me in' 意为「算我一个」。'each' 表示「每人一块」。",
      },
      {
        id: "s11",
        text: "She had already arranged an important meeting that weekend, so she asked me to buy both watches and keep one for myself.",
        translation: "她那个周末已经安排了一个重要的会议，所以她请我把两块表都买下来，自己留一块。",
        grammar:
          "过去完成时 'had arranged' 表示在过去某动作之前已完成。'ask sb to do sth'。",
      },
      {
        id: "s12",
        text: "\"No problem,\" I told her. Now I can't wait for the weekend to try my own new digital watch.",
        translation: "「没问题，」我对她说。现在我都等不及周末去试试我自己的新电子表了。",
        grammar:
          "'can't wait to do sth' 表示「迫不及待想做某事」。'my own' 强调「我自己的」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        word: "humid",
        question: "The word 'humid' describes weather that is —",
        options: [
          "warm and wet",
          "cold and dry",
          "bright and sunny",
          "windy and clear",
        ],
        correctAnswer: "warm and wet",
        explanation:
          "The cousin is bothered by London's damp, humid (warm and wet) air.",
      },
      {
        id: "q2",
        type: "detail",
        question: "What can the digital watch do?",
        options: [
          "Report and predict the weather",
          "Make phone calls only",
          "Cook food",
          "Translate languages",
        ],
        correctAnswer: "Report and predict the weather",
        explanation:
          "It reports the weather wherever she goes and predicts sunny times.",
      },
      {
        id: "q3",
        type: "main_idea",
        question: "What is the story mainly about?",
        options: [
          "A smart watch that reports the weather",
          "How to travel to London",
          "Why goldfish need care",
          "A ballet exam",
        ],
        correctAnswer: "A smart watch that reports the weather",
        explanation:
          "The whole chat is about a digital watch that can report and predict the weather.",
      },
      {
        id: "q4",
        type: "tense",
        question:
          "\"For more than a year now, my cousin has lived in London.\" What tense is 'has lived'?",
        options: [
          "Present perfect",
          "Simple past",
          "Simple present",
          "Future",
        ],
        correctAnswer: "Present perfect",
        explanation:
          "'has lived' with 'for over a year' shows an action that started in the past and continues now — the present perfect.",
      },
      {
        id: "q5",
        type: "vocabulary",
        word: "deserve",
        question: "What does 'deserve' mean?",
        options: [
          "To be worth something",
          "To forget something",
          "To break something",
          "To hurry",
        ],
        correctAnswer: "To be worth something",
        explanation:
          "\"It deserves the price\" means the watch is worth that price.",
      },
      {
        id: "q6",
        type: "vocabulary",
        word: "forecast",
        question: "What is a weather 'forecast'?",
        options: [
          "A report of what the weather will be",
          "A kind of strong wind",
          "A photo of the sky",
          "A warm coat",
        ],
        correctAnswer: "A report of what the weather will be",
        explanation:
          "A forecast tells you what the weather will be — the cousin says London's forecast is hard to trust.",
      },
      {
        id: "q7",
        type: "detail",
        question:
          "Why couldn't the cousin buy the watches herself that weekend?",
        options: [
          "She was ill in bed",
          "She had already arranged an important meeting",
          "The shop was too far away",
          "She had no money left",
        ],
        correctAnswer: "She had already arranged an important meeting",
        explanation:
          "She had already arranged an important meeting that weekend, so she asked the narrator to buy both watches.",
      },
      {
        id: "q8",
        type: "grammar",
        question:
          "\"It can't be cheap,\" I said. What does 'can't be' express here?",
        options: [
          "That something is not allowed",
          "An ability someone lost",
          "A confident guess that something is not true",
          "A past habit",
        ],
        correctAnswer: "A confident guess that something is not true",
        explanation:
          "'can't be' here is a deduction — the speaker is almost sure the watch is not cheap.",
      },
      {
        id: "q9",
        type: "tense",
        question:
          "\"She had already arranged an important meeting.\" Why 'had arranged'?",
        options: [
          "The arranging happened earlier, before the watch plan came up",
          "The arranging is happening now",
          "The arranging is a future plan",
          "It shows the meeting never happened",
        ],
        correctAnswer:
          "The arranging happened earlier, before the watch plan came up",
        explanation:
          "'had + past participle' (past perfect) marks the earlier past action — the meeting was arranged before the shopping plan.",
      },
    ],
  },
  {
    id: "weekly-4-crazy-weather",
    topicId: "weekly-stories",
    track: "weekly-stories",
    weekNumber: 4,
    title: "The Weather Must Be Crazy",
    chineseTitle: "疯狂的天气",
    subtitle:
      "A gale, a rising river, and a rescue boat — luckily, only in a dream.",
    focus: {
      zh: "极端天气与梦境：用生动的词汇描述一场暴风雨。",
      en: "Extreme weather in a dream: vivid words for a storm.",
    },
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "\"Wake up! Breakfast is ready!\" My mother's call pulled me out of the strangest dream I have ever had.",
        translation:
          "「快起床！早饭好了！」妈妈的呼唤把我从有生以来最奇怪的梦里拉了出来。",
        grammar:
          "'pull sb out of sth' 意为「把某人从……中拉出来」。'the strangest ... I have ever had' 是「最高级 + 现在完成时」的常用搭配。",
      },
      {
        id: "s2",
        text: "My heart was still racing, so at breakfast I told my family about my crazy dream of extreme weather.",
        translation:
          "我的心还在怦怦直跳，于是早餐时我给家人讲了这个关于极端天气的疯狂梦境。",
        grammar:
          "'so' 连接因果关系的两个分句。'tell sb about sth' 表示「向某人讲述某事」。",
      },
      {
        id: "s3",
        text: "In the dream, a gale was blowing through our town, and the rain fell harder and harder.",
        translation: "梦里，一场烈风吹过我们的小镇，雨越下越大。",
        grammar:
          "过去进行时 'was blowing' 描述背景。「比较级 + and + 比较级」表示「越来越……」。",
      },
      {
        id: "s4",
        text: "The river behind our school kept rising, and by the afternoon the playground had turned into a lake.",
        translation:
          "学校后面的河水不断上涨，到下午，操场已经变成了一个湖。",
        grammar:
          "'keep + doing' 表示「不断……」。过去完成时 'had turned' 强调「到那时已经完成」。",
      },
      {
        id: "s5",
        text: "On the radio, the mayor declared our town a disaster zone and asked everyone to move to higher ground.",
        translation:
          "市长在广播里宣布我们镇为灾区，并要求大家转移到高处。",
        grammar:
          "'declare + 宾语 + 名词' 表示「宣布……为……」。'ask sb to do sth' 表示「要求某人做某事」。",
      },
      {
        id: "s6",
        text: "Rescue teams arrived in boats to assist the people who were trapped in their homes.",
        translation: "救援队乘船赶来，协助被困在家中的人们。",
        grammar:
          "不定式 'to assist ...' 表示目的。'who were trapped ...' 是定语从句，修饰 the people。",
      },
      {
        id: "s7",
        text: "The icy water reached our knees as we waded to one of the boats and climbed in.",
        translation:
          "冰冷的水没过了我们的膝盖，我们蹚水走到其中一条船边，爬了上去。",
        grammar:
          "'as' 引导时间状语从句，表示「当……的时候」。'one of + 复数名词' 表示「其中之一」。",
      },
      {
        id: "s8",
        text: "I was shaking with cold — in a few minutes I felt completely frozen.",
        translation: "我冷得发抖——没几分钟就觉得整个人都冻僵了。",
        grammar:
          "'shake with cold' 表示「冷得发抖」。'completely + 极端形容词'（frozen）加强语气。",
      },
      {
        id: "s9",
        text: "Suddenly, lightning lit up the dark sky, and in that white flash I saw an old man slip at the edge of the boat.",
        translation:
          "突然，闪电照亮了昏暗的天空，在那道白光里，我看见一位老人在船边滑倒了。",
        grammar:
          "'see sb do sth' 表示看到动作的全过程（这里是「滑倒」这一下）。",
      },
      {
        id: "s10",
        text: "Everyone tried to approach him, but the boat was rocking too hard in the storm.",
        translation: "大家都想靠近他，可船在暴风雨中摇晃得太厉害了。",
        grammar:
          "'approach' 是及物动词，后面直接接宾语，不需要加 to。",
      },
      {
        id: "s11",
        text: "I reached out again and again until I was exhausted — and just when my fingers finally caught his coat, the dream ended.",
        translation:
          "我一次又一次地伸出手，直到筋疲力尽——就在我的手指终于抓住他外套的那一刻，梦结束了。",
        grammar:
          "'again and again' 表示「一次又一次」。'until' 引导时间状语从句。",
      },
      {
        id: "s12",
        text: "\"So the old man was me — I was shaking you awake!\" laughed my father, and the whole table burst out laughing.",
        translation:
          "「那个老人就是我呀——是我摇你起床的！」爸爸笑着说，全桌人都大笑起来。",
        grammar:
          "'burst out laughing' 表示「突然大笑起来」。破折号引出恍然大悟的补充说明。",
      },
      {
        id: "s13",
        text: "Outside the window, the morning sun was shining warmly; none of it was real, and I was glad it was only a dream.",
        translation:
          "窗外，清晨的阳光温暖地照耀着；那一切都不是真的，我很庆幸那只是一场梦。",
        grammar:
          "'none of it' 表示「那一切都不」。过去进行时 'was shining' 与梦中的风雨形成对比。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        word: "exhausted",
        question:
          "\"I reached out again and again until I was exhausted.\" What does 'exhausted' mean?",
        options: [
          "Extremely tired",
          "Very excited",
          "Slightly cold",
          "Very brave",
        ],
        correctAnswer: "Extremely tired",
        explanation:
          "'Exhausted' means extremely tired — the narrator reached out so many times that no strength was left.",
      },
      {
        id: "q2",
        type: "vocabulary",
        word: "assist",
        question:
          "Rescue teams arrived to 'assist' the trapped people. What does 'assist' mean?",
        options: [
          "To watch quietly",
          "To help",
          "To leave quickly",
          "To take photos",
        ],
        correctAnswer: "To help",
        explanation:
          "'Assist' is a more formal word for 'help' — the rescue teams came to help the people trapped in their homes.",
      },
      {
        id: "q3",
        type: "vocabulary",
        word: "zone",
        question:
          "The mayor declared the town a disaster 'zone'. What is a 'zone'?",
        options: [
          "A kind of boat",
          "A loud sound",
          "An area of land",
          "A heavy rain",
        ],
        correctAnswer: "An area of land",
        explanation:
          "A zone is an area — a disaster zone is an area hit by a disaster.",
      },
      {
        id: "q4",
        type: "detail",
        question: "Who declared the town a disaster zone in the dream?",
        options: [
          "A rescue-team captain",
          "The mayor, on the radio",
          "The narrator's father",
          "A school teacher",
        ],
        correctAnswer: "The mayor, on the radio",
        explanation:
          "On the radio, the mayor declared the town a disaster zone and asked everyone to move to higher ground.",
      },
      {
        id: "q5",
        type: "detail",
        question: "What did the narrator see in the flash of lightning?",
        options: [
          "A big ship arriving",
          "The playground turning into a lake",
          "A rainbow over the river",
          "An old man slipping at the edge of the boat",
        ],
        correctAnswer: "An old man slipping at the edge of the boat",
        explanation:
          "In the white flash of lightning, the narrator saw an old man slip at the edge of the boat.",
      },
      {
        id: "q6",
        type: "main_idea",
        question: "What is the story mainly about?",
        options: [
          "A frightening dream about extreme weather",
          "A news report about a real flood",
          "How to row a rescue boat",
          "A family holiday by the sea",
        ],
        correctAnswer: "A frightening dream about extreme weather",
        explanation:
          "The gale, the flood, and the rescue all happen inside a dream — the narrator is telling it at breakfast.",
      },
      {
        id: "q7",
        type: "tense",
        question:
          "\"By the afternoon the playground had turned into a lake.\" Why 'had turned'?",
        options: [
          "The change was already complete by that past time",
          "It is happening right now",
          "It will happen tomorrow",
          "It never happened",
        ],
        correctAnswer: "The change was already complete by that past time",
        explanation:
          "Past perfect (had turned) shows the change was finished before that moment in the past — by the afternoon.",
      },
      {
        id: "q8",
        type: "grammar",
        question:
          "\"We waded to one of the boats.\" Which is correct after 'one of'?",
        options: [
          "A singular noun: one of the boat",
          "A plural noun: one of the boats",
          "An adverb: one of quickly",
          "A base verb: one of climb",
        ],
        correctAnswer: "A plural noun: one of the boats",
        explanation:
          "When 'one of' is followed by a countable noun, that noun is plural — one of the boats, one of my friends.",
      },
      {
        id: "q9",
        type: "comparative",
        question:
          "\"The rain fell harder and harder.\" What does 'harder and harder' mean?",
        options: [
          "The rain stayed the same",
          "The rain was about to stop",
          "The rain kept getting stronger",
          "The rain was very soft",
        ],
        correctAnswer: "The rain kept getting stronger",
        explanation:
          "'comparative + and + comparative' (harder and harder) shows something increasing all the time.",
      },
    ],
  },
  {
    id: "weekly-5-boss-day",
    topicId: "weekly-stories",
    track: "weekly-stories",
    weekNumber: 5,
    title: "Boss Day",
    chineseTitle: "老板日",
    subtitle:
      "For one day at school, some students become bosses — and some hunt for jobs.",
    focus: {
      zh: "职业体验：招聘、职位与求职面试的常用词汇。",
      en: "Jobs & roles: hiring, positions, and interview words.",
    },
    level: "Intermediate",
    minutes: 4,
    sentences: [
      {
        id: "s1",
        text: "Last Friday, a long line of \"job hunters\" stood outside our classroom, and I sat behind a desk feeling both nervous and proud.",
        translation:
          "上周五，一长队「求职者」站在我们教室外面，而我坐在桌子后面，既紧张又自豪。",
        grammar:
          "'both ... and ...' 表示「既……又……」。'feeling ...' 现在分词短语作伴随状语。",
      },
      {
        id: "s2",
        text: "It was Boss Day, a special school activity that lets students learn about the world of work.",
        translation:
          "那天是「老板日」——一个让学生了解职场的特别学校活动。",
        grammar:
          "'that lets students learn ...' 是定语从句，修饰 activity。'let sb do sth' 后接动词原形。",
      },
      {
        id: "s3",
        text: "The rules are simple: half of us become employers, and the other half become candidates who apply for jobs.",
        translation:
          "规则很简单：一半人当雇主，另一半人当申请工作的候选人。",
        grammar:
          "冒号引出具体说明。'the other half' 表示「另一半」。'apply for' 意为「申请」。",
      },
      {
        id: "s4",
        text: "As an employer, I opened a little film company and put up a notice with all the open positions.",
        translation:
          "作为雇主，我开了一家小电影公司，并贴出了一张写着所有空缺职位的告示。",
        grammar:
          "'as' 表示「作为」。'put up' 意为「张贴」。'with all the open positions' 作 notice 的后置定语。",
      },
      {
        id: "s5",
        text: "I called it \"Superhero\" because detective and science-fiction movies are my favourites.",
        translation:
          "我给它取名「超级英雄」，因为侦探电影和科幻电影是我的最爱。",
        grammar:
          "'call + 宾语 + 名字' 表示「把……叫作……」。'because' 引导原因状语从句。",
      },
      {
        id: "s6",
        text: "My notice offered one full-time position for a director and several part-time positions for actors and cameramen.",
        translation:
          "我的告示上有一个全职的导演职位，还有几个演员和摄影师的兼职职位。",
        grammar:
          "'full-time'（全职的）和 'part-time'（兼职的）是一对反义词。'cameramen' 是 'cameraman' 的不规则复数。",
      },
      {
        id: "s7",
        text: "Candidates filled in application forms, and the best ones were invited to a short interview.",
        translation:
          "候选人们填写申请表，表现最好的被邀请参加简短的面试。",
        grammar:
          "'fill in' 意为「填写」。'were invited' 是被动语态。代词 'ones' 指代前面的 candidates。",
      },
      {
        id: "s8",
        text: "One girl admitted that she had never used a camera before, but she promised to learn fast.",
        translation:
          "一个女孩承认她以前从没用过摄像机，但她保证会很快学会。",
        grammar:
          "'admit that ...' 后接宾语从句。过去完成时 'had never used' 表示「在那之前从未」。",
      },
      {
        id: "s9",
        text: "I hired her at once because an honest and easy-going worker is worth more than a \"perfect\" one.",
        translation:
          "我立刻录用了她，因为一个诚实又随和的员工比一个「完美」的员工更可贵。",
        grammar:
          "'at once' 意为「立刻」。'be worth more than ...' 表示「比……更有价值」。",
      },
      {
        id: "s10",
        text: "The accountant position was much harder to fill: doing the accounts all day sounded so tiring that nobody applied.",
        translation:
          "会计师这个职位就难招多了：整天记账听起来太累人了，以至于没有人来申请。",
        grammar:
          "动名词短语 'doing the accounts all day' 作主语。'so + 形容词 + that ...' 表示「如此……以至于……」。",
      },
      {
        id: "s11",
        text: "So I raised the salary on my notice, and soon three candidates were waiting at my table too.",
        translation:
          "于是我提高了告示上的薪水，很快也有三名候选人等在我的桌前了。",
        grammar:
          "'raise' 是及物动词，「提高（某物）」，注意与不及物的 'rise' 区分。",
      },
      {
        id: "s12",
        text: "Every new worker signed a simple contract, which listed their duty, working hours, and pay.",
        translation:
          "每位新员工都签了一份简单的合同，上面列着他们的职责、工作时间和报酬。",
        grammar:
          "'which listed ...' 是非限定性定语从句，补充说明 contract。'duty' 意为「职责」。",
      },
      {
        id: "s13",
        text: "By the end of the day, my little company was full, and my classmates called me \"the friendliest boss\" of Boss Day.",
        translation:
          "一天结束时，我的小公司满员了，同学们叫我「老板日」上「最友善的老板」。",
        grammar:
          "'by the end of ...' 表示「到……结束时」。'the friendliest' 是形容词最高级。",
      },
      {
        id: "s14",
        text: "Being a boss for one day taught me something real: a good employer cares about people, not just positions.",
        translation:
          "当一天老板让我明白了一个实实在在的道理：好雇主关心的是人，而不只是职位。",
        grammar:
          "动名词短语 'Being a boss for one day' 作主语。'not just' 表示「不只是」。",
      },
    ],
    quiz: [
      {
        id: "q1",
        type: "vocabulary",
        word: "candidate",
        question: "On Boss Day, who is a 'candidate'?",
        options: [
          "A person who applies for a job",
          "A person who owns the school",
          "A person who cooks lunch",
          "A person who directs movies",
        ],
        correctAnswer: "A person who applies for a job",
        explanation:
          "Candidates are the job hunters — the students who apply for the jobs the bosses offer.",
      },
      {
        id: "q2",
        type: "vocabulary",
        word: "salary",
        question: "What is a 'salary'?",
        options: [
          "A kind of contract",
          "The money a worker is paid for the job",
          "A job interview",
          "A company's name",
        ],
        correctAnswer: "The money a worker is paid for the job",
        explanation:
          "A salary is the money paid for work — the narrator raised it to attract candidates to the accountant position.",
      },
      {
        id: "q3",
        type: "vocabulary",
        word: "honest",
        question: "What does 'honest' mean?",
        options: [
          "Working very fast",
          "Full of new ideas",
          "Telling the truth; not lying",
          "Easy to teach",
        ],
        correctAnswer: "Telling the truth; not lying",
        explanation:
          "An honest person tells the truth — like the girl who admitted she had never used a camera.",
      },
      {
        id: "q4",
        type: "detail",
        question: "What did the narrator name the film company?",
        options: ["Detective", "Superhero", "Boss Day", "Sci-Fi Star"],
        correctAnswer: "Superhero",
        explanation:
          "Detective and science-fiction movies are the narrator's favourites, so the company was called \"Superhero\".",
      },
      {
        id: "q5",
        type: "detail",
        question:
          "Why did nobody apply for the accountant position at first?",
        options: [
          "The position was already taken",
          "The teacher did not allow it",
          "Doing the accounts all day sounded too tiring",
          "It paid the highest salary",
        ],
        correctAnswer: "Doing the accounts all day sounded too tiring",
        explanation:
          "Doing the accounts all day sounded so tiring that nobody applied — until the salary was raised.",
      },
      {
        id: "q6",
        type: "main_idea",
        question: "What is the story mainly about?",
        options: [
          "How to make a real movie",
          "A school activity where students practice hiring and job hunting",
          "Why accountants earn a lot",
          "The life of a famous director",
        ],
        correctAnswer:
          "A school activity where students practice hiring and job hunting",
        explanation:
          "Boss Day is a school job fair — students play employers and candidates to practice job skills.",
      },
      {
        id: "q7",
        type: "grammar",
        question:
          "\"I raised the salary.\" Why 'raise' and not 'rise' here?",
        options: [
          "'raise' takes an object (raise the salary); 'rise' does not",
          "'rise' is only used for the sun",
          "'raise' is the past form of 'rise'",
          "They are exactly the same",
        ],
        correctAnswer:
          "'raise' takes an object (raise the salary); 'rise' does not",
        explanation:
          "'raise' is transitive — you raise something (the salary); 'rise' has no object (the river rose).",
      },
      {
        id: "q8",
        type: "tense",
        question:
          "\"She admitted that she had never used a camera before.\" What does 'had never used' tell us?",
        options: [
          "It describes a future plan",
          "It is a habit she still has",
          "It refers to a time before another past moment — before that interview",
          "It makes the sentence a question",
        ],
        correctAnswer:
          "It refers to a time before another past moment — before that interview",
        explanation:
          "Past perfect (had never used) looks back from a past moment: up to that interview, she had never used a camera.",
      },
      {
        id: "q9",
        type: "singular_plural",
        question:
          "One cameraman joined the crew first. Then two more ___ joined.",
        options: ["cameramans", "cameraman", "cameramen", "cameramens"],
        correctAnswer: "cameramen",
        explanation:
          "'cameraman' has an irregular plural, like man → men: one cameraman → two cameramen.",
      },
    ],
  },
];

// The 18-week Weekly Stories index. Weeks 1–5 are fully integrated and link
// to real articles; later weeks have no `articleId` yet and render as
// "coming soon" cards, so they never create a broken route.
export const weeklyStories: WeeklyStory[] = [
  {
    week: 1,
    titleEn: "The Power of Friendship",
    titleZh: "友谊的力量",
    theme: { zh: "友谊与坚持", en: "Friendship & persistence" },
    articleId: "weekly-1-friendship",
  },
  {
    week: 2,
    titleEn: "A Stupid Mistake",
    titleZh: "一个愚蠢的错误",
    theme: { zh: "善待动物 · 不要想当然", en: "Caring for animals" },
    articleId: "weekly-2-stupid-mistake",
  },
  {
    week: 3,
    titleEn: "A Digital Watch",
    titleZh: "一块电子表",
    theme: { zh: "天气与科技", en: "Weather & technology" },
    articleId: "weekly-3-digital-watch",
  },
  {
    week: 4,
    titleEn: "The Weather Must Be Crazy",
    titleZh: "疯狂的天气",
    theme: { zh: "多变的天气", en: "Strange, changing weather" },
    articleId: "weekly-4-crazy-weather",
  },
  {
    week: 5,
    titleEn: "Boss Day",
    titleZh: "老板日",
    theme: { zh: "职业体验", en: "Jobs & roles" },
    articleId: "weekly-5-boss-day",
  },
  {
    week: 6,
    titleEn: "A Policeman and His Diving Coach",
    titleZh: "警察和他的潜水教练",
    theme: { zh: "勇气与救援", en: "Courage & rescue" },
  },
  {
    week: 7,
    titleEn: "A Cool Surprise Party",
    titleZh: "酷酷的惊喜派对",
    theme: { zh: "惊喜与友情", en: "A surprise party" },
  },
  {
    week: 8,
    titleEn: "A Silly Behaviour",
    titleZh: "一个犯傻的举动",
    theme: { zh: "诚实与反思", en: "Honesty & reflection" },
  },
  {
    week: 9,
    titleEn: "The Journey to London",
    titleZh: "伦敦之旅",
    theme: { zh: "旅行见闻", en: "A journey to London" },
  },
  {
    week: 10,
    titleEn: "Transport",
    titleZh: "交通方式",
    theme: { zh: "交通工具", en: "Ways to get around" },
  },
  {
    week: 11,
    titleEn: "Approaching the Earth",
    titleZh: "走近地球",
    theme: { zh: "太空与地球", en: "Space & the Earth" },
  },
  {
    week: 12,
    titleEn: "Let's Go to the Farm",
    titleZh: "去农场吧",
    theme: { zh: "农场的一天", en: "A day at the farm" },
  },
  {
    week: 13,
    titleEn: "Take Good Care of Your Body!",
    titleZh: "照顾好你的身体！",
    theme: { zh: "爱护身体", en: "Take care of your body" },
  },
  {
    week: 14,
    titleEn: "Sports Count a Lot",
    titleZh: "运动很重要",
    theme: { zh: "运动的意义", en: "Why sports matter" },
  },
  {
    week: 15,
    titleEn: "Our Environment Matters",
    titleZh: "环境很重要",
    theme: { zh: "保护环境", en: "Our environment matters" },
  },
  {
    week: 16,
    titleEn: "Rubbish Sorting",
    titleZh: "垃圾分类",
    theme: { zh: "垃圾分类", en: "Sorting rubbish" },
  },
  {
    week: 17,
    titleEn: "Communication and Technology",
    titleZh: "沟通与科技",
    theme: { zh: "沟通与科技", en: "Communication & technology" },
  },
  {
    week: 18,
    titleEn: "Robots",
    titleZh: "机器人",
    theme: { zh: "机器人", en: "Robots" },
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

  // weekly-1: The Power of Friendship
  generous: {
    word: "generous",
    pronunciation: "/ˈdʒenərəs/",
    partOfSpeech: "adj.",
    definition: "Happy to give or share with others.",
    translation: "慷慨的；大方的",
    example: "She is generous and always shares her snacks.",
    exampleTranslation: "她很大方，总是分享自己的零食。",
  },
  fond: {
    word: "fond",
    pronunciation: "/fɒnd/",
    partOfSpeech: "adj.",
    definition: "Liking something a lot (usually 'be fond of').",
    translation: "喜爱的",
    example: "My sister is fond of painting.",
    exampleTranslation: "我妹妹喜欢画画。",
  },
  anxious: {
    word: "anxious",
    pronunciation: "/ˈæŋkʃəs/",
    partOfSpeech: "adj.",
    definition: "Worried and uneasy about something.",
    translation: "焦虑的；担心的",
    example: "He felt anxious before the big game.",
    exampleTranslation: "大赛前他感到焦虑。",
  },
  disappointing: {
    word: "disappointing",
    pronunciation: "/ˌdɪsəˈpɔɪntɪŋ/",
    partOfSpeech: "adj.",
    definition: "Not as good as you hoped.",
    translation: "令人失望的",
    example: "The movie had a disappointing ending.",
    exampleTranslation: "这部电影的结局令人失望。",
  },
  embarrassed: {
    word: "embarrassed",
    pronunciation: "/ɪmˈbærəst/",
    partOfSpeech: "adj.",
    definition: "Feeling shy or uncomfortable in front of others.",
    translation: "尴尬的；难为情的",
    example: "I felt embarrassed when I forgot her name.",
    exampleTranslation: "我忘了她的名字，感到很尴尬。",
  },
  comfort: {
    word: "comfort",
    pronunciation: "/ˈkʌmfət/",
    partOfSpeech: "n. & v.",
    definition: "To make someone feel better when they are sad.",
    translation: "安慰；慰藉",
    example: "She hugged the crying boy to comfort him.",
    exampleTranslation: "她抱住哭泣的男孩安慰他。",
  },
  confident: {
    word: "confident",
    pronunciation: "/ˈkɒnfɪdənt/",
    partOfSpeech: "adj.",
    definition: "Sure that you can do something well.",
    translation: "自信的",
    example: "After practice, she felt confident on stage.",
    exampleTranslation: "练习之后，她在台上很自信。",
  },
  encourage: {
    word: "encourage",
    pronunciation: "/ɪnˈkʌrɪdʒ/",
    partOfSpeech: "v.",
    definition: "To give someone hope, courage, or support.",
    translation: "鼓励；激励",
    example: "My teacher encouraged me to keep trying.",
    exampleTranslation: "老师鼓励我继续努力。",
  },
  reliable: {
    word: "reliable",
    pronunciation: "/rɪˈlaɪəbl/",
    partOfSpeech: "adj.",
    definition: "Able to be trusted or depended on.",
    translation: "可靠的；可信赖的",
    example: "A reliable friend keeps their promises.",
    exampleTranslation: "可靠的朋友会信守承诺。",
  },
  courage: {
    word: "courage",
    pronunciation: "/ˈkʌrɪdʒ/",
    partOfSpeech: "n.",
    definition: "Being brave when something is hard or scary.",
    translation: "勇气；勇敢",
    example: "It takes courage to try again after failing.",
    exampleTranslation: "失败后再试一次需要勇气。",
  },

  // weekly-2: A Stupid Mistake
  homeless: {
    word: "homeless",
    pronunciation: "/ˈhəʊmləs/",
    partOfSpeech: "adj.",
    definition: "Having no home to live in.",
    translation: "无家可归的；流浪的",
    example: "They gave food to the homeless cat.",
    exampleTranslation: "他们给那只流浪猫喂食。",
  },
  annoyed: {
    word: "annoyed",
    pronunciation: "/əˈnɔɪd/",
    partOfSpeech: "adj.",
    definition: "A little angry.",
    translation: "恼怒的；生气的",
    example: "She was annoyed by the loud noise.",
    exampleTranslation: "她被吵闹声弄得很恼火。",
  },
  guilty: {
    word: "guilty",
    pronunciation: "/ˈɡɪlti/",
    partOfSpeech: "adj.",
    definition: "Feeling bad because you did something wrong.",
    translation: "内疚的；惭愧的",
    example: "He felt guilty for breaking the cup.",
    exampleTranslation: "他因为打碎杯子而感到内疚。",
  },
  confused: {
    word: "confused",
    pronunciation: "/kənˈfjuːzd/",
    partOfSpeech: "adj.",
    definition: "Not able to understand something clearly.",
    translation: "困惑的；糊涂的",
    example: "The map was hard to read and I got confused.",
    exampleTranslation: "地图很难看懂，我被弄糊涂了。",
  },
  bossy: {
    word: "bossy",
    pronunciation: "/ˈbɒsi/",
    partOfSpeech: "adj.",
    definition: "Always telling other people what to do.",
    translation: "爱指挥人的；专横的",
    example: "My bossy cousin tells everyone where to sit.",
    exampleTranslation: "我那爱指挥人的表弟告诉每个人该坐哪。",
  },
  ashamed: {
    word: "ashamed",
    pronunciation: "/əˈʃeɪmd/",
    partOfSpeech: "adj.",
    definition: "Feeling bad or sorry about something you did.",
    translation: "惭愧的；羞愧的",
    example: "He was ashamed of his rude words.",
    exampleTranslation: "他为自己粗鲁的话感到惭愧。",
  },
  relieved: {
    word: "relieved",
    pronunciation: "/rɪˈliːvd/",
    partOfSpeech: "adj.",
    definition: "Glad that a worry or problem is over.",
    translation: "宽慰的；放心的",
    example: "I was relieved when the test was finally over.",
    exampleTranslation: "考试终于结束，我松了一口气。",
  },
  gentle: {
    word: "gentle",
    pronunciation: "/ˈdʒentl/",
    partOfSpeech: "adj.",
    definition: "Kind and soft, not rough.",
    translation: "温柔的；温和的",
    example: "Be gentle when you hold the baby.",
    exampleTranslation: "抱婴儿时要轻柔。",
  },
  inspire: {
    word: "inspire",
    pronunciation: "/ɪnˈspaɪə(r)/",
    partOfSpeech: "v.",
    definition: "To make someone want to do something good.",
    translation: "激励；鼓舞",
    example: "Her story inspired us to help others.",
    exampleTranslation: "她的故事激励我们去帮助别人。",
  },
  elder: {
    word: "elder",
    pronunciation: "/ˈeldə(r)/",
    partOfSpeech: "adj.",
    definition: "Older (used for people in a family).",
    translation: "年长的（家庭中）",
    example: "My elder brother teaches me math.",
    exampleTranslation: "我哥哥教我数学。",
  },

  common: {
    word: "common",
    pronunciation: "/ˈkɒmən/",
    partOfSpeech: "adj.",
    definition: "Happening often, or shared by many people.",
    translation: "常见的；共同的",
    example: "Rain is common here in spring.",
    exampleTranslation: "这里春天常下雨。",
  },
  sense: {
    word: "sense",
    pronunciation: "/sens/",
    partOfSpeech: "n.",
    definition:
      "Good judgement; the ability to think and decide sensibly. ('common sense' = practical good judgement.)",
    translation: "判断力；理智（common sense 常识）",
    example: "She had the good sense to ask an adult for help.",
    exampleTranslation: "她很明智，懂得向大人求助。",
  },

  // weekly-3: A Digital Watch
  humid: {
    word: "humid",
    pronunciation: "/ˈhjuːmɪd/",
    partOfSpeech: "adj.",
    definition: "Warm and wet (about weather).",
    translation: "潮湿的；闷热的",
    example: "Summers here are hot and humid.",
    exampleTranslation: "这里的夏天又热又潮湿。",
  },
  climate: {
    word: "climate",
    pronunciation: "/ˈklaɪmət/",
    partOfSpeech: "n.",
    definition: "The usual weather of a place.",
    translation: "气候",
    example: "Hainan has a warm climate.",
    exampleTranslation: "海南气候温暖。",
  },
  forecast: {
    word: "forecast",
    pronunciation: "/ˈfɔːkɑːst/",
    partOfSpeech: "n. & v.",
    definition: "A report of what the weather will be.",
    translation: "预报；预测",
    example: "The forecast says it will rain tomorrow.",
    exampleTranslation: "天气预报说明天有雨。",
  },
  mild: {
    word: "mild",
    pronunciation: "/maɪld/",
    partOfSpeech: "adj.",
    definition: "Not too hot and not too cold; gentle.",
    translation: "温和的；温暖的",
    example: "We had a mild winter this year.",
    exampleTranslation: "今年冬天很温和。",
  },
  breeze: {
    word: "breeze",
    pronunciation: "/briːz/",
    partOfSpeech: "n.",
    definition: "A light, gentle wind.",
    translation: "微风；和风",
    example: "A cool breeze blew from the sea.",
    exampleTranslation: "海上吹来一阵凉爽的微风。",
  },
  freezing: {
    word: "freezing",
    pronunciation: "/ˈfriːzɪŋ/",
    partOfSpeech: "adj.",
    definition: "Very, very cold.",
    translation: "极冷的；冰冻的",
    example: "Wear a coat — it's freezing outside.",
    exampleTranslation: "穿件外套——外面冷极了。",
  },
  affect: {
    word: "affect",
    pronunciation: "/əˈfekt/",
    partOfSpeech: "v.",
    definition: "To change or influence something.",
    translation: "影响",
    example: "Bad weather can affect our plans.",
    exampleTranslation: "坏天气会影响我们的计划。",
  },
  wise: {
    word: "wise",
    pronunciation: "/waɪz/",
    partOfSpeech: "adj.",
    definition: "Able to make good, sensible decisions.",
    translation: "明智的；充满智慧的",
    example: "It was wise to bring an umbrella.",
    exampleTranslation: "带伞是明智的。",
  },
  deserve: {
    word: "deserve",
    pronunciation: "/dɪˈzɜːv/",
    partOfSpeech: "v.",
    definition: "To be worth something because of what you did.",
    translation: "值得；应得",
    example: "You worked hard, so you deserve a rest.",
    exampleTranslation: "你很努力，应该休息一下。",
  },
  predict: {
    word: "predict",
    pronunciation: "/prɪˈdɪkt/",
    partOfSpeech: "v.",
    definition: "To say what will happen in the future.",
    translation: "预测；预言",
    example: "Can the watch predict tomorrow's weather?",
    exampleTranslation: "这块表能预测明天的天气吗？",
  },
};

export function getArticle(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

// Build base-form candidates for a word so simple inflections still match a
// dictionary entry. Conservative: only strips when the result stays long
// enough, and a candidate only "wins" later if it actually exists in a
// dictionary, which keeps false positives (e.g. "as" -> "a") from showing.
function candidateForms(key: string): string[] {
  const forms = [key];
  const add = (f: string) => {
    if (f.length >= 3 && !forms.includes(f)) forms.push(f);
  };
  if (key.length >= 4) {
    if (key.endsWith("ies")) add(key.slice(0, -3) + "y"); // stories -> story
    if (key.endsWith("ied")) add(key.slice(0, -3) + "y"); // tried -> try
    // "-es" only when the stem ends in a sibilant (the real -es plural/verb
    // rule), so we don't manufacture junk stems like "choic" or "mistak".
    let esHandled = false;
    if (key.endsWith("es") && /(?:s|x|z|ch|sh)$/.test(key.slice(0, -2))) {
      add(key.slice(0, -2)); // wishes -> wish, boxes -> box, classes -> class
      esHandled = true;
    }
    // Generic "-s" only if the sibilant "-es" branch didn't already handle the
    // word (otherwise we'd add a residual stem like "wishe"). Skip "ss" words.
    if (!esHandled && key.endsWith("s") && !key.endsWith("ss"))
      add(key.slice(0, -1)); // shoes -> shoe, choices -> choice, mistakes -> mistake
    if (key.endsWith("ed")) {
      add(key.slice(0, -2)); // wanted -> want
      add(key.slice(0, -1)); // lived -> live
      const b = key.slice(0, -2);
      if (b.length >= 3 && b[b.length - 1] === b[b.length - 2])
        add(b.slice(0, -1)); // stopped -> stop
    }
    if (key.endsWith("ing")) {
      add(key.slice(0, -3)); // asking -> ask
      add(key.slice(0, -3) + "e"); // making -> make
      const b = key.slice(0, -3);
      if (b.length >= 3 && b[b.length - 1] === b[b.length - 2])
        add(b.slice(0, -1)); // running -> run
    }
  }
  return forms;
}

// Lookup priority: Weekly Stories dictionary, then the general dictionary —
// each tried with the exact key first, then normalized (de-inflected) forms.
// (A per-article vocabulary tier could be added in front of these later.)
// Falls back to a friendly "not in the dictionary yet" entry.
export function lookupWord(raw: string, locale: Locale = defaultLocale): WordEntry {
  const key = raw.toLowerCase().replace(/[^a-z']/g, "");
  for (const form of candidateForms(key)) {
    const hit = weeklyDictionary[form] ?? dictionary[form];
    if (hit) return hit;
  }
  const t = getDict(locale);
  return { word: raw, translation: t.panel.notInDict };
}
