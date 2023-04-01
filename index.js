import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()

//Consts
const PORT=8005
const app=express()

const transporter=nodemailer.createTransport({
	service:'gmail',
	auth:{
		user:`${process.env.USERMAIL}`,
		pass:`${process.env.PASS}`
	}
})

const handlebarOptions={ 
	viewEngine:{
		partialsDir: path.resolve('./views/'),
        	defaultLayout: false},
	viewPath:path.resolve('./views/')
}



//Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
transporter.use('compile',hbs(handlebarOptions))
//routes

app.get('/',(req,res)=>{
	res.status(201).end("Success")
})

app.post('/getUserDetails',(req,res)=>{
	
	const {Name,Contact,Email,Message}=req.body
	
	const mailOptions={
	from:`${process.env.USERMAIL}`,
	to:`${process.env.TOMAIL}`,
	subject:'Hello from Divakar',
	template:'email',
	context:{ 
		Name,
		Contact,
		Email,
		Message
		}
	}

	transporter.sendMail(mailOptions, function(error, info){
  		if (error) {
 			console.log(error)
 			res.status(500).send("ERROR!")
  		} else {
    		console.log('Email sent: ' + info.response);
    		res.status(201).end("Success!")}
	});
})

app.listen(PORT,()=>console.log(`Listening @${PORT}`))
