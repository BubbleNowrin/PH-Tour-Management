import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import envVars from "./app/config/env";

let server: Server;


const startServer=async()=>{
try {
await mongoose.connect(envVars.DB_URL);

console.log("connected to DB!!!!");

server=app.listen(envVars.PORT,()=>{
    console.log(`Server is listening to port ${envVars.PORT}`);
})
    
} catch (error) {
    console.log(error);
}
}

startServer();

process.on("SIGTERM",()=>{
    console.log("SIGTERM Signal received...server shutting down");

    if(server){
        server.close(()=>{
            process.exit(1);
        });
    }

    process.exit(1);
})

process.on("unhandledRejection",(err)=>{
    console.log("unhandled rejection detected...server shutting down",err);

    if(server){
        server.close(()=>{
            process.exit(1);
        });
    }

    process.exit(1);
})

process.on("uncaughtException",(err)=>{
    console.log("uncaught exception detected...server shutting down",err);

    if(server){
        server.close(()=>{
            process.exit(1);
        });
    }

    process.exit(1);
})

// Unhandled rejection Error
// Promise.reject(new Error("Unhandled Rejection Error"));

//Uncaught Exception Error
// throw new Error("Uncaught Exception Error");




/*Errors to be handled in server

--- Unhandled rejection Error ---> when promises are rejected and not handled those rejections with try catch

--- Uncaught Rejection Error ---> when theres errors not related to promises and not handled with try catch

--- sigterm error ---> when the deployed server is terminating , to hande that

--main target: gracefully shutting down server

*/