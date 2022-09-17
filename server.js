import mongoose from 'mongoose';
async function main() {
    await mongoose.connect('mongodb+srv://kharwar719:Rohit%4098331@cluster0.zg9smuj.mongodb.net/?retryWrites=true&w=majority');

}
main().catch(err => console.log(err));
import fetch from 'node-fetch';
import express from 'express';
const app = express()
const ticketSchema = new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String,
});
const Tickets = mongoose.model('Tickets', ticketSchema)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next()
})

app.get('/', (req, res) => {
    res.send('Hi from server');

})

app.get('/top10', async (req, res) => {
    const data = await Tickets.find()
    res.json({ data })

})
app.get('/wazirx', async (req, res) => {
    const tickets = await fetch("https://api.wazirx.com/api/v2/tickers");
    const response = await tickets.json();
    const allTickets = Object.values(response).slice(0, 10)

    await Tickets.deleteMany({})

    allTickets.forEach(async (ticket) => {
        await Tickets.create({
            name: ticket.name,
            last: ticket.last,
            buy: ticket.buy,
            sell: ticket.sell,
            volume: ticket.volume,
            base_unit: ticket.base_unit,
        })
    })

    res.json(allTickets)



})
app.listen(4000, (error) => {
    if (error) {
        console.warn(error);
        return

    }

    console.log(" app listening on port 4000")
})


