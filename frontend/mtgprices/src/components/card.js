const cardExample = {
    name: 'Avenger of Zendikar',
    img: 'https://cards.scryfall.io/large/front/9/6/9685faa0-46cc-4098-9ad7-cffece741baa.jpg?1673484460',
    price: 2.51
}

export default function Card() {
    return (
        <div>
            <h1>{cardExample.name}</h1>
            <h1>Price: {cardExample.price}$</h1>
            <img src = {cardExample.img}/>
        </div>
    )
}