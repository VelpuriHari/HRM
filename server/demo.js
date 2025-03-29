const Role = "jhj";
const Scope = "";
const Support = "";
const Peroid = "knde";

const sql = `update support set ${
  (Role.length !== 0 ? `Role ='${Role}',` : ``,
  Scope.length !== 0 ? `Scope ='${Scope}',` : ``,
  Support.length !== 0 ? `Suppport ='${Support}',` : ``,
  Peroid.length !== 0 ? `Acc_Year ='${Peroid}'` : ``)
} where support_userid=;`;
console.log(sql);
