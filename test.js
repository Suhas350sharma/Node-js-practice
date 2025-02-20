const os=require("os");
const path=require('path');

console.log(os.type());//logs os name

console.log(os.machine());//logs the machiene name

console.log(os.hostname());//logs the host name

console.log(__dirname);//logs the dir name including root path

console.log(__filename);//logs the file name including root path

console.log(path.dirname(__filename));//logs the dirname including root path

console.log(path.parse(__filename));//create a object that will consists all the file information

console.log(path.join(__dirname,"test"));//joins the path
