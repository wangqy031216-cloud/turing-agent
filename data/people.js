/* =====================================================================
   People — shown on people.html.

   - Each group gets a heading (e.g. "Core contributors", later "Advisors").
   - Photos: square image in assets/img/people/<slug>.webp (shown as a circle).
   - Fill in `position`, `education` and `interests` when ready; empty ones
     show as a blank line. HTML is allowed, e.g. <a href="...">lab</a>.
   - `links` is optional: [{ label: "Homepage", href: "https://..." }].

   Member (copy, edit):

   {
     name: "First Last",
     name_zh: "中文名",
     photo: "assets/img/people/first-last.webp",
     position: "",     // where they work, e.g. "Researcher, Shanghai AI Laboratory"
     education: "",    // where they graduated, e.g. "Ph.D., XX University"
     interests: "",    // what they are interested in
     links: []
   },
   ===================================================================== */
window.TA = window.TA || {};

TA.people = {
  intro: "The team behind Turing Agent.",
  groups: [
    {
      title: "Core contributors",
      members: [
        { name: "Qianyi Wang",  name_zh: "王钎屹", photo: "assets/img/people/qianyi-wang.webp",  position: "", education: "", interests: "", links: [] },
        { name: "Shuyue Hu",    name_zh: "胡舒悦", photo: "assets/img/people/shuyue-hu.webp",    position: "", education: "", interests: "", links: [] },
        { name: "Yang Chen",    name_zh: "陈阳",   photo: "assets/img/people/yang-chen.webp",    position: "", education: "", interests: "", links: [] },
        { name: "Ronghui Yang", name_zh: "杨荣晖", photo: "assets/img/people/ronghui-yang.webp", position: "", education: "", interests: "", links: [] },
        { name: "Zhanhao Li",   name_zh: "李展豪", photo: "assets/img/people/zhanhao-li.webp",   position: "", education: "", interests: "", links: [] },
        { name: "Yu Cong",      name_zh: "丛宇",   photo: "assets/img/people/yu-cong.webp",      position: "", education: "", interests: "", links: [] }
      ]
    }
  ]
};
