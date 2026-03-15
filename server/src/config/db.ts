import knex, { Knex } from "knex";
import dotenv from 'dotenv'

dotenv.config()


const {PGPORT,PGHOST, PGDATABASE, PGUSER, PGPASSWORD, DATABASE_URL} = process.env

export const db = knex({
    client:'pg',
    connection:{
        // host:PGHOST,
        // port:PGPORT,
        // password:PGPASSWORD,
        // database:PGDATABASE,
        // user:PGUSER,
        connectionString:DATABASE_URL,
        ssl:{rejectUnauthorized:false}
    }
})
