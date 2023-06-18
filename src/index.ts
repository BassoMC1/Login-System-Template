import CreateApp from "./utils/CreateApp"
import Routers from "./utils/routers"
import { config } from "dotenv"
config()

export default new CreateApp({ 
    port: "8080", 
    MongooseUrl: process.env.MongooseURL, 
    CorsOrginUrl: "http://localhost:3000" 
}).run()
 
new Routers().Build()
