/* =====================================================================
   People — shown on people.html.

   Author order, affiliation numbers and contribution marks follow the report.
   Photos live in assets/img/people/; an empty photo stays blank.
   Each member references affiliation IDs and marks defined below.
   ===================================================================== */
window.TA = window.TA || {};

TA.people = {
  intro: "The authors of Turing Agent.",
  groups: [
    {
      title: "",
      members: [
        {
          name: "Yang Chen",
          name_zh: "陈阳",
          photo: "assets/img/people/yang-chen.webp",
          affiliations: [1],
          marks: ["⋆"]
        },
        {
          name: "Qianyi Wang",
          name_zh: "王钎屹",
          photo: "assets/img/people/qianyi-wang.webp",
          affiliations: [1],
          marks: ["⋆"]
        },
        {
          name: "Ronghui Yang",
          name_zh: "杨荣晖",
          photo: "assets/img/people/ronghui-yang.webp",
          affiliations: [1],
          marks: ["∗"]
        },
        {
          name: "Zhanhao Li",
          name_zh: "李展豪",
          photo: "assets/img/people/zhanhao-li.webp",
          affiliations: [1],
          marks: ["∗"]
        },
        {
          name: "Yu Cong",
          name_zh: "丛宇",
          photo: "assets/img/people/yu-cong.webp",
          affiliations: [1, 2],
          marks: []
        },
        {
          name: "Chen Zhang",
          name_zh: "张晨",
          photo: "assets/img/people/chen-zhang.webp",
          affiliations: [1],
          marks: []
        },
        {
          name: "Hangfan Zhang",
          name_zh: "张航帆",
          photo: "assets/img/people/hangfan-zhang.webp",
          affiliations: [1],
          marks: []
        },
        {
          name: "Shao Zhang",
          name_zh: "张劭",
          photo: "assets/img/people/shao-zhang.webp",
          affiliations: [1],
          marks: []
        },
        {
          name: "Shuai Li",
          name_zh: "李帅",
          photo: "assets/img/people/shuai-li.webp",
          affiliations: [3],
          marks: []
        },
        {
          name: "Toru Takisaka",
          photo: "assets/img/people/toru-takisaka.webp",
          affiliations: [2],
          marks: []
        },
        {
          name: "Chao Xu",
          name_zh: "许超",
          photo: "assets/img/people/chao-xu.webp",
          affiliations: [2],
          marks: []
        },
        {
          name: "Yi Zhou",
          name_zh: "周毅",
          photo: "assets/img/people/yi-zhou.webp",
          affiliations: [2],
          marks: []
        },
        {
          name: "Zhihao Tang",
          name_zh: "唐志皓",
          photo: "assets/img/people/zhihao-tang.webp",
          affiliations: [4],
          marks: []
        },
        {
          name: "Xiao Wang",
          name_zh: "王皛",
          photo: "assets/img/people/xiao-wang.webp",
          affiliations: [4],
          marks: []
        },
        {
          name: "Bo Zhang",
          name_zh: "张铂",
          photo: "assets/img/people/bo-zhang.webp",
          affiliations: [1],
          marks: ["†"]
        },
        {
          name: "Shuyue Hu",
          name_zh: "胡舒悦",
          photo: "assets/img/people/shuyue-hu.webp",
          affiliations: [1],
          marks: ["†"]
        }
      ]
    }
  ],
  affiliations: [
    {
      id: 1,
      institution: "Shanghai Artificial Intelligence Laboratory",
      unit: "Agent Center"
    },
    {
      id: 2,
      institution: "University of Electronic Science and Technology of China",
      unit: "Algorithms and Logic Group"
    },
    {
      id: 3,
      institution: "The University of Hong Kong",
      unit: "School of Computing and Data Science"
    },
    {
      id: 4,
      institution: "Shanghai University of Finance and Economics",
      unit: "Institute for Theoretical Computer Science"
    }
  ],
  roles: [
    { mark: "⋆", label: "Lead Author" },
    { mark: "∗", label: "Core Contributor" },
    { mark: "†", label: "Project Lead" }
  ]
};
