/* =====================================================================
   People — shown on people.html.

   - Each group gets a heading (e.g. "Core contributors", later "Advisors").
   - Headshot-only cards: circular photo with the name underneath.
   - Photos: square image in assets/img/people/<slug>.webp.

   Member (copy, edit):

   {
     name: "First Last",
     name_zh: "中文名",
     photo: "assets/img/people/first-last.webp"
   },
   ===================================================================== */
window.TA = window.TA || {};

TA.people = {
  intro: "The team behind Turing Agent.",
  groups: [
    {
      title: "Core contributors",
      members: [
        { name: "Yang Chen",    name_zh: "陈阳",   photo: "assets/img/people/yang-chen.webp" },
        { name: "Qianyi Wang",  name_zh: "王钎屹", photo: "assets/img/people/qianyi-wang.webp" },
        { name: "Ronghui Yang", name_zh: "杨荣晖", photo: "assets/img/people/ronghui-yang.webp" },
        { name: "Zhanhao Li",   name_zh: "李展豪", photo: "assets/img/people/zhanhao-li.webp" },
        { name: "Yu Cong",      name_zh: "丛宇",   photo: "assets/img/people/yu-cong.webp" },
        { name: "Shuyue Hu",    name_zh: "胡舒悦", photo: "assets/img/people/shuyue-hu.webp" }
      ]
    }
  ]
};
