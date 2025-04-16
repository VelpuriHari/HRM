const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyparser = require("body-parser");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyparser.json());
const upload = multer({ storage: multer.memoryStorage() });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "W7301@jqir#",
  database: "hrm",
});

app.get("/", (req, res) => {
  return res.json("From backend side");
});
app.get("/support", (req, res) => {
  const Scope = req.query.scope ? req.query.scope.split(",") : [];
  const Acc_Year = req.query.Acc_Year ? req.query.Acc_Year.split(",") : [];
  const userid = req.query.userid;
  const gender = req.query.gender;
  const qualification = req.query.qualification
    ? req.query.qualification.split(",")
    : [];

  let sql = `
    SELECT s.* 
    FROM support s 
    JOIN employee e ON s.EmployeeID = e.EmployeeID
  `;

  const conditions = [];

  if (userid) {
    conditions.push(`s.EmployeeID = '${userid}'`);
  }

  if (Scope.length > 0) {
    const scopeList = Scope.map((id) => `"${id}"`).join(",");
    conditions.push(`s.Scope IN (${scopeList})`);
  }

  if (Acc_Year.length > 0) {
    const Acc_YearList = Acc_Year.map((id) => `"${id}"`).join(",");
    conditions.push(`s.Acc_Year IN (${Acc_YearList})`);
  }

  if (gender) {
    conditions.push(`e.Gender = "${gender}"`);
  }

  if (qualification.length > 0) {
    const qualList = qualification.map((q) => `"${q}"`).join(",");
    conditions.push(`e.HighestQualification IN (${qualList})`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += ";";
  console.log(sql);

  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/////////support delete
app.delete("/support", (req, res) => {
  const userid = req.query.userid;
  const EmplooyeId = req.query.EmplooyeId;
  const Role = req.query.Role;
  const Support = req.query.Support;
  const Peroid = req.query.Peroid;
  const sql = `delete from support where  EmployeeID='${userid}' and Role='${Role}' and Support='${Support}'; `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
/////////support insert
app.post("/support", (req, res) => {
  const { EmployeeId, Role, Scope, Support, Peroid } = req.body;
  console.log("Modi");
  console.log(Scope);
  const sql = `insert into support (EmployeeID,Role,Scope,Support,Acc_Year)  values('${EmployeeId}','${Role}','${Scope}','${Support}','${Peroid}') `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
/////// support update
app.put("/support", (req, res) => {
  const { EmployeeID, Role, Scope, Support, Peroid, support_userid } = req.body;
  console.log(Role, Scope, Support);
  console.log(Role);

  sql = `update support set `;
  sql += Role.length !== 0 ? `Role ='${Role}',` : ``;
  sql += Scope.length !== 0 ? `Scope ='${Scope}',` : ``;
  sql += Support.length !== 0 ? `Support ='${Support}',` : ``;
  sql += Peroid.length !== 0 ? ` Acc_Year ='${Peroid}',` : ``;
  sql += `EmployeeID='${EmployeeID}'`;
  sql += `where support_userid=${support_userid};`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

//////////// Publication Get
app.get("/publications", (req, res) => {
  const IndexedIn = req.query.IndexedIn ? req.query.IndexedIn.split(",") : [];
  const Year = req.query.Year ? req.query.Year.split(",") : [];
  const userid = req.query.userid;
  const gender = req.query.gender;
  const qualification = req.query.qualification
    ? req.query.qualification.split(",")
    : [];

  let sql = `
    SELECT jp.* 
    FROM journalpublications jp 
    JOIN employee e ON jp.EmployeeID = e.EmployeeID
  `;
  const conditions = [];

  if (userid) {
    conditions.push(`jp.EmployeeID = ${mysql.escape(userid)}`);
  }

  if (IndexedIn.length > 0) {
    const indexList = IndexedIn.map((val) => mysql.escape(val)).join(",");
    conditions.push(`jp.IndexedIn IN (${indexList})`);
  }

  if (Year.length > 0) {
    const yearList = Year.map((val) => mysql.escape(val)).join(",");
    conditions.push(`jp.Year IN (${yearList})`);
  }

  if (gender) {
    conditions.push(`e.Gender = ${mysql.escape(gender)}`);
  }

  if (qualification.length > 0) {
    const qualList = qualification.map((val) => mysql.escape(val)).join(",");
    conditions.push(`e.HighestQualification IN (${qualList})`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log("SQL:", sql);

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

///////////Publications Delete
app.delete("/publications", (req, res) => {
  const journalid = req.query.journalid;
  const sql = `delete from journalpublications where  journalid='${journalid}'; `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
/////////Publications insert
app.post("/publications", (req, res) => {
  const {
    EmployeeID,
    Title,
    PaperTitle,
    ISSN,
    Details,
    IndexedIn,
    Month,
    Year,
  } = req.body;
  console.log("Modi");
  const sql = `insert into journalpublications ( EmployeeID,Title,PaperTitle,ISSN, Details,IndexedIn, Month, Year)  values('${EmployeeID}','${Title}','${PaperTitle}','${ISSN}', '${Details}','${IndexedIn}','${Month}','${Year}') `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
/////// Publications update
app.put("/publications", (req, res) => {
  const {
    EmployeeID,
    Title,
    PaperTitle,
    ISSN,
    Details,
    IndexedIn,
    Month,
    Year,
    journalid,
  } = req.body;

  sql = `update journalpublications set `;
  sql += Title.length !== 0 ? `Title ='${Title}',` : ``;
  sql += PaperTitle.length !== 0 ? `PaperTitle ='${PaperTitle}',` : ``;
  sql += ISSN.length !== 0 ? `ISSN ='${ISSN}',` : ``;
  sql += Details.length !== 0 ? ` Details ='${Details}',` : ``;
  sql += IndexedIn.length !== 0 ? ` IndexedIn ='${IndexedIn}',` : ``;
  sql += Month.length !== 0 ? ` Month ='${Month}',` : ``;
  sql += Year.length !== 0 ? ` Year ='${Year}',` : ``;
  sql += ` EmployeeID='${EmployeeID}'`;
  sql += ` where journalid=${journalid};`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

///////// tlp get
app.get("/tlp", (req, res) => {
  const Sec = req.query.Sec ? req.query.Sec.split(",") : [];
  const Year = req.query.Year ? req.query.Year.split(",") : [];
  const gender = req.query.gender;
  const qualification = req.query.qualification
    ? req.query.qualification.split(",")
    : [];
  const userid = req.query.userid;

  let sql = `
    SELECT t.* 
    FROM tlp t 
    JOIN employee e ON t.EmployeeID = e.EmployeeID
  `;

  const conditions = [];

  if (userid) {
    conditions.push(`t.EmployeeID = ${mysql.escape(userid)}`);
  }

  if (Sec.length > 0) {
    const secFilter = Sec.map((s) => mysql.escape(s)).join(",");
    conditions.push(`t.Sec IN (${secFilter})`);
  }

  if (Year.length > 0) {
    const yearFilter = Year.map((y) => mysql.escape(y)).join(",");
    conditions.push(`t.Acc_Year IN (${yearFilter})`);
  }

  if (gender) {
    conditions.push(`e.Gender = ${mysql.escape(gender)}`);
  }

  if (qualification.length > 0) {
    const qualFilter = qualification.map((q) => mysql.escape(q)).join(",");
    conditions.push(`e.HighestQualification IN (${qualFilter})`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += ";";
  console.log("SQL:", sql);

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

//////////////tlp delete
app.delete("/tlp", (req, res) => {
  const tlpuserid = req.query.tlpuserid;

  const sql = `delete from tlp where tlpuserid='${tlpuserid}'; `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
////////// tlp add
app.post("/tlp", (req, res) => {
  const {
    EmployeeID,
    Course,
    CourseCode,
    Year,
    Semester,
    Sec,
    ScheduledClasses,
    HeldClasses,
    No_ofStudentsRegistered,
    No_ofStudentsPassed,
    No_ofStudentsGivenFeedback,
    FeedbackResult,
    Acc_Year,
  } = req.body;
  const sql = `insert into tlp (EmployeeID,Course,CourseCode,Year,Semester,Sec,ScheduledClasses,HeldClasses,No_ofStudentsRegistered,No_ofStudentsPassed,No_ofStudentsGivenFeedback,FeedbackResult,Acc_Year)  values('${EmployeeID}','${Course}','${CourseCode}','${Year}','${Semester}','${Sec}','${ScheduledClasses}','${HeldClasses}','${No_ofStudentsRegistered}','${No_ofStudentsPassed}','${No_ofStudentsGivenFeedback}','${FeedbackResult}','${Acc_Year}') ;`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
/////////// tlp update
app.put("/tlp", (req, res) => {
  const {
    EmployeeID,
    Course,
    CourseCode,
    Year,
    Semester,
    Sec,
    ScheduledClasses,
    HeldClasses,
    No_ofStudentsRegistered,
    No_ofStudentsPassed,
    No_ofStudentsGivenFeedback,
    FeedbackResult,
    Acc_Year,
    tlpuserid,
  } = req.body;
  console.log(HeldClasses);

  sql = `update tlp set `;
  sql += Course.length !== 0 ? `Course ='${Course}',` : ``;
  sql += CourseCode.length !== 0 ? `CourseCode ='${CourseCode}',` : ``;
  sql += Year.length !== 0 ? `Year ='${Year}',` : ``;
  sql += Semester.length !== 0 ? ` Semester ='${Semester}', ` : ``;
  sql += Sec.length !== 0 ? ` Sec ='${Sec}', ` : ``;
  sql +=
    ScheduledClasses.length !== 0
      ? ` ScheduledClasses ='${ScheduledClasses}', `
      : ``;
  sql += HeldClasses.length !== 0 ? ` HeldClasses ='${HeldClasses}', ` : ``;
  sql +=
    No_ofStudentsRegistered.length !== 0
      ? ` No_ofStudentsRegistered ='${No_ofStudentsRegistered}', `
      : ``;
  sql +=
    No_ofStudentsPassed.length !== 0
      ? ` No_ofStudentsPassed ='${No_ofStudentsPassed}', `
      : ``;
  sql +=
    No_ofStudentsGivenFeedback.length !== 0
      ? ` No_ofStudentsGivenFeedback ='${No_ofStudentsGivenFeedback}', `
      : ``;
  sql +=
    FeedbackResult.length !== 0 ? ` FeedbackResult ='${FeedbackResult}', ` : ``;
  sql += Acc_Year.length !== 0 ? ` Acc_Year ='${Acc_Year}', ` : ``;

  sql += `EmployeeID='${EmployeeID}'`;
  sql += ` where tlpuserid=${tlpuserid};`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
///////////Certifications
app.get("/certifications", (req, res) => {
  const userid = req.query.userid;
  const Acc_Year = req.query.Acc_Year ? req.query.Acc_Year.split(",") : [];
  const gender = req.query.gender;
  const qualification = req.query.qualification
    ? req.query.qualification.split(",")
    : [];

  let sql = `
    SELECT c.* 
    FROM onlinecertifications c
    JOIN employee e ON c.EmployeeID = e.EmployeeID
  `;

  const conditions = [];

  if (userid) {
    conditions.push(`c.EmployeeID = '${userid}'`);
  }

  if (Acc_Year.length > 0) {
    const yearFilter = Acc_Year.map((y) => `"${y}"`).join(",");
    conditions.push(`c.Acc_Year IN (${yearFilter})`);
  }

  if (gender) {
    conditions.push(`e.Gender = '${gender}'`);
  }

  if (qualification.length > 0) {
    const qualFilter = qualification.map((q) => `"${q}"`).join(",");
    conditions.push(`e.HighestQualification IN (${qualFilter})`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log(sql);

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

//////////////certifications delete
app.delete("/certifications", (req, res) => {
  const certificationid = req.query.certificationid;

  const sql = `delete from onlinecertifications where certificationid='${certificationid}'; `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
////////// certifications add
app.post("/certifications", (req, res) => {
  const { EmployeeID, CertificationName, Provider, Duration, Acc_Year } =
    req.body;
  const sql = `insert into onlinecertifications (EmployeeID, CertificationName,  Provider, Duration, Acc_Year)  values('${EmployeeID}','${CertificationName}','${Provider}','${Duration}','${Acc_Year}') ;`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
/////////// certifications update
app.put("/certifications", (req, res) => {
  const {
    EmployeeID,
    CertificationName,
    Provider,
    Duration,
    Acc_Year,
    certificationid,
  } = req.body;

  sql = `update onlinecertifications set `;
  sql +=
    CertificationName.length !== 0
      ? `CertificationName ='${CertificationName}',`
      : ``;
  sql += Provider.length !== 0 ? `Provider ='${Provider}',` : ``;
  sql += Duration.length !== 0 ? `Duration ='${Duration}',` : ``;
  sql += Acc_Year.length !== 0 ? ` Acc_Year ='${Acc_Year}', ` : ``;
  sql += `EmployeeID='${EmployeeID}'`;
  sql += ` where certificationid=${certificationid};`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
//////////////Events
app.get("/eventinfo", (req, res) => {
  const userid = req.query.userid;
  const Role = req.query.Role ? req.query.Role.split(",") : [];
  const Acc_Year = req.query.Acc_Year ? req.query.Acc_Year.split(",") : [];
  const gender = req.query.gender;
  const qualification = req.query.qualification
    ? req.query.qualification.split(",")
    : [];

  let sql = `
    SELECT eventinfo.* 
    FROM eventinfo 
    JOIN employee ON eventinfo.EmployeeID = employee.EmployeeID
  `;

  let conditions = [];

  if (userid) {
    conditions.push(`eventinfo.EmployeeID = ${mysql.escape(userid)}`);
  }

  if (Role.length > 0) {
    const roleFilter = Role.map((r) => mysql.escape(r)).join(",");
    conditions.push(`eventinfo.Role IN (${roleFilter})`);
  }

  if (Acc_Year.length > 0) {
    const yearFilter = Acc_Year.map((y) => mysql.escape(y)).join(",");
    conditions.push(`eventinfo.Acc_Year IN (${yearFilter})`);
  }

  if (gender) {
    conditions.push(`employee.Gender = ${mysql.escape(gender)}`);
  }

  if (qualification.length > 0) {
    const qualificationFilter = qualification
      .map((q) => mysql.escape(q))
      .join(",");
    conditions.push(
      `employee.HighestQualification IN (${qualificationFilter})`
    );
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log(sql);

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

/////////events delete
app.delete("/eventinfo", (req, res) => {
  const eventuserid = req.query.eventuserid;

  const sql = `delete from eventinfo where eventuserid='${eventuserid}'; `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
/////////events insert
app.post("/eventinfo", (req, res) => {
  const { EmployeeID, ProgramName, DateFrom, DateTo, Outcome, Role, Acc_year } =
    req.body;
  const sql = `insert into eventinfo (EmployeeID,ProgramName, DateFrom,DateTo,Outcome,Role,Acc_year)  values('${EmployeeID}','${ProgramName}','${DateFrom}','${DateTo}','${Outcome}','${Role}','${Acc_year}') ;`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
/////// events update
app.put("/eventinfo", (req, res) => {
  const {
    EmployeeID,
    ProgramName,
    DateFrom,
    DateTo,
    Outcome,
    Role,
    Acc_year,
    eventuserid,
  } = req.body;

  sql = `update eventinfo set `;
  sql += ProgramName.length !== 0 ? ` ProgramName ='${ProgramName}',` : ``;
  sql += DateFrom.length !== 0 ? ` DateFrom ='${DateFrom}',` : ``;
  sql += DateTo.length !== 0 ? ` DateTo ='${DateTo}',` : ``;
  sql += Outcome.length !== 0 ? ` Outcome ='${Outcome}',` : ``;
  sql += Role.length !== 0 ? ` Role ='${Role}',` : ``;
  sql += Acc_year.length !== 0 ? ` Acc_year ='${Acc_year}',` : ``;
  sql += ` EmployeeID='${EmployeeID}'`;
  sql += ` where eventuserid=${eventuserid};`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

/////////////Patents
app.get("/patents", (req, res) => {
  const userid = req.query.userid;
  const Acc_Year = req.query.Acc_Year ? req.query.Acc_Year.split(",") : [];
  const Status = req.query.Status ? req.query.Status.split(",") : [];
  const gender = req.query.gender;
  const qualification = req.query.qualification
    ? req.query.qualification.split(",")
    : [];

  let sql = `
    SELECT patents.* 
    FROM patents 
    JOIN employee ON patents.EmployeeID = employee.EmployeeID
  `;

  let conditions = [];

  if (userid) {
    conditions.push(`patents.EmployeeID = ${mysql.escape(userid)}`);
  }

  if (Acc_Year.length > 0) {
    const yearFilter = Acc_Year.map((year) => mysql.escape(year)).join(",");
    conditions.push(`patents.Acc_Year IN (${yearFilter})`);
  }

  if (Status.length > 0) {
    const statusFilter = Status.map((s) => mysql.escape(s)).join(",");
    conditions.push(`patents.Status IN (${statusFilter})`);
  }

  if (gender) {
    conditions.push(`employee.Gender = ${mysql.escape(gender)}`);
  }

  if (qualification.length > 0) {
    const qualificationFilter = qualification
      .map((q) => mysql.escape(q))
      .join(",");
    conditions.push(
      `employee.HighestQualification IN (${qualificationFilter})`
    );
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  console.log(sql);

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

/////////patents delete
app.delete("/patents", (req, res) => {
  const patentuserid = req.query.patentuserid;

  const sql = `delete from patents where patentuserid='${patentuserid}'; `;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
/////////patents insert
app.post("/patents", (req, res) => {
  const {
    EmployeeID,
    Title,
    Application_Number,
    date_of_filing,
    Status,
    date_of_grant,
    Acc_year,
  } = req.body;
  const sql = `insert into patents (EmployeeID,Title, Application_Number, date_of_filing, Status, date_of_grant,Acc_year)  values('${EmployeeID}','${Title}','${Application_Number}','${date_of_filing}','${Status}','${date_of_grant}','${Acc_year}') ;`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});
/////// patents update
app.put("/patents", (req, res) => {
  const {
    EmployeeID,
    Title,
    Application_Number,
    date_of_filing,
    Status,
    date_of_grant,
    Acc_year,
    patentuserid,
  } = req.body;

  sql = `update patents set `;
  sql += Title.length !== 0 ? ` Title ='${Title}',` : ``;
  sql +=
    Application_Number.length !== 0
      ? ` Application_Number ='${Application_Number}',`
      : ``;
  sql +=
    date_of_filing.length !== 0 ? ` date_of_filing ='${date_of_filing}',` : ``;
  sql += Status.length !== 0 ? ` Status ='${Status}',` : ``;
  sql +=
    date_of_grant.length !== 0 ? ` date_of_grant ='${date_of_grant}',` : ``;
  sql += Acc_year.length !== 0 ? ` Acc_year ='${Acc_year}',` : ``;
  sql += ` EmployeeID='${EmployeeID}'`;
  sql += ` where patentuserid=${patentuserid};`;
  console.log(sql);
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

//////////// users post
app.post("/users", (req, res) => {
  const { userid, email, password } = req.body;
  console.log(userid + " " + email + " " + password);
  const sql = `insert into user values("${userid}","${password}","${email}","${password}")`;
  db.query(sql, (err, data) => {
    if (err) return res.json(false);
    return res.json(true);
  });
  //res.json({ message: `Received user ${name} with ID ${userId}` });
});
//////////users get
app.get("/users", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  const sql = "SELECT userid, password FROM user WHERE email = ?";
  db.query(sql, [email], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    if (data.length > 0 && password === data[0].password) {
      return res.status(200).json({ success: true, user: data[0] });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  });
});
app.put("/users", (req, res) => {
  const { userid, email, password } = req.body;
  const sql = `UPDATE user SET email = "${email}", password = "${password}" WHERE userid = "${userid}"`;
  console.log(userid + " " + email + " " + password);
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  });
});
///////////
app.get("/emplyooe", (req, res) => {
  const EmployeeID = req.query.login;
  const sql = `SELECT * FROM employee WHERE EmployeeID=?`; // Fetch all columns

  db.query(sql, [EmployeeID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "No employee found" });
    }

    const employee = result[0]; // Get first matching employee
    if (!employee.Photo) {
      return res.json({ ...employee, Photo: null }); // Handle missing photo
    }

    // Convert Buffer to Base64
    const base64Photo = Buffer.from(employee.Photo).toString("base64");
    res.json({ ...employee, Photo: `data:image/jpeg;base64,${base64Photo}` });
  });
});
// PUT update employee
app.put("/employee", (req, res) => {
  const login = req.query.login;
  const {
    Name,
    Designation,
    Department,
    DateOfJoining,
    Email,
    Mobile,
    HighestQualification,
    Photo, // base64 string or null
  } = req.body;

  const photoBuffer = Photo ? Buffer.from(Photo.split(",")[1], "base64") : null;
  console.log(photoBuffer);
  console.log(Photo);
  const sql = `
    UPDATE employee
    SET Name=?, Designation=?, Department=?, DateOfJoining=?, Email=?, Mobile=?, HighestQualification=?, Photo=?
    WHERE EmployeeID=?
  `;
  const values = [
    Name,
    Designation,
    Department,
    DateOfJoining,
    Email,
    Mobile,
    HighestQualification,
    photoBuffer,
    login,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json({ message: "Updated successfully" });
  });
});
app.post("/upload-photo", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
    "base64"
  )}`;
  res.json({ base64 });
});

////////////////////////////////Analysis
/////HighestQualification
app.get("/HighestQulification", (req, res) => {
  sql = `select count(*) as data  from employee group by HighestQualification;`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    else {
      console.log(
        data.map((id) => {
          return id.data;
        })
      );
      return res.json(
        data.map((id) => {
          return id.data;
        })
      );
    }
  });
});
////////////
app.get("/event", (req, res) => {
  sql = `select count(*) as data  from eventinfo group by Role;`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    else {
      console.log(
        data.map((id) => {
          return id.data;
        })
      );
      return res.json(
        data.map((id) => {
          return id.data;
        })
      );
    }
  });
});
////////////Designation
app.get("/designation", (req, res) => {
  sql = `select count(*) as data  from employee group by Designation;`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    else {
      console.log(
        data.map((id) => {
          return id.data;
        })
      );
      return res.json(
        data.map((id) => {
          return id.data;
        })
      );
    }
  });
});
//////////// Journalpublications
app.get("/journalpublications", (req, res) => {
  sql = `select count(*) as data  from journalpublications group by Year;`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    else {
      console.log(
        data.map((id) => {
          return id.data;
        })
      );
      return res.json(
        data.map((id) => {
          return id.data;
        })
      );
    }
  });
});
//////////// onlinecertifications
app.get("/onlinecertifications", (req, res) => {
  sql = `select count(*) as data  from onlinecertifications group by Acc_Year;`;
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    else {
      console.log(
        data.map((id) => {
          return id.data;
        })
      );
      return res.json(
        data.map((id) => {
          return id.data;
        })
      );
    }
  });
});

app.listen(8081, () => {
  console.log("Connected..........");
});
