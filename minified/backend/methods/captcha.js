async function captcha(e){const t=`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${e.body.token}`;try{return!!(await fetch(t,{method:"get"}).then((e=>e.json()))).success}catch(e){res.send(e)}}require("dotenv").config(),module.exports=captcha;