export interface Adventure {
  image: string
  text: string
  subtext: string
  minitext: string
  minitext2: string
  topic: string
}



export const adventure: Adventure[] = [
  {
    image: "/img/home/adv1.svg",
    text: "For Football Prediction Lovers",
    subtext: "Pick between teams you think would win and it gets settled once the match plays out.",
    minitext: "$ Predict who wins the match",
    minitext2: "$ Europe 5 leagues",
    topic: "Artificial Intelligence"
  },
  {
    image: "/img/home/adv2.svg",
    text: "For Crypto Bros",
    subtext: "Predict the price of your favourite crypto, now available in $AVAX $BTC $SOL $BNB $ETH.",
    minitext: "$ Predict price of the market",
    minitext2: "$ BTC, SOL, BNB, ETH, AVAX",
    topic: "Markets"
  }
]