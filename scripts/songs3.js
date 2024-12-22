let songs = [
  {
    name: "Head In The Clouds",
    cover:
      "https://image.bugsm.co.kr/album/images/original/7502/750285.jpg?version=undefined",
    artist: "88rising, Joji",
    audio: "./노래/99.mp3",
    id: 0,
  },
  {
    name: "Paris",
    cover:
      "https://i.genius.com/964852643086bb178db40d1e3db32d1ce0132ac0?url=http%3A%2F%2Fis2.mzstatic.com%2Fimage%2Fthumb%2FMusic111%2Fv4%2Fcf%2Fd8%2F26%2Fcfd82644-646c-53ec-6f4e-3719fa91dcdb%2Fsource%2F1200x1200bb.jpg",
    artist: "The Chainsmokers",
    audio: "./노래/98.mp3",
    id: 1,
  },
  {
    name: "All Around",
    cover:
      "https://t2.genius.com/unsafe/300x0/https%3A%2F%2Fimages.genius.com%2F5ccc6f2392e74446f004d8b701a57330.1000x1000x1.jpg",
    artist: "Surfaces",
    audio: "./노래/97.mp3",
    id: 2,
  },
  {
    name: "Dancing With Nobody",
    cover:
      "https://t2.genius.com/unsafe/300x0/https%3A%2F%2Fimages.genius.com%2F5ccc6f2392e74446f004d8b701a57330.1000x1000x1.jpg",
    artist: "Surfaces",
    audio: "./노래/96.mp3",
    id: 3,
  },
  {
    name: "Miss Me (Demo)",
    cover:
      "https://t2.genius.com/unsafe/357x0/https%3A%2F%2Fimages.genius.com%2Ff40656c6eaa10b16e968ea19a35ba7f8.1000x1000x1.jpg",
    artist: "Lauv",
    audio: "./노래/95.mp3",
    id: 4,
  },
  {
    name: "Dead End",
    cover:
      "https://t2.genius.com/unsafe/848x0/https%3A%2F%2Fimages.genius.com%2F726451b2cecb16dfc980585142b11462.999x999x1.jpg",
    artist: "Boy In Space",
    audio: "./노래/94.mp3",
    id: 5,
  },
  {
    name: "Vertigo",
    cover:
      "https://t2.genius.com/unsafe/848x0/https%3A%2F%2Fimages.genius.com%2F48ca10fe4ca2ae201fa0b0437c13d72c.1000x1000x1.jpg",
    artist: "Khalid",
    audio: "./노래/93.mp3",
    id: 6,
  },
  {
    name: "Thick And Thin",
    cover:
      "https://t2.genius.com/unsafe/848x0/https%3A%2F%2Fimages.genius.com%2F34840e82a20310e952a927c0e52c3b3f.1000x1000x1.jpg",
    artist: "LANY",
    audio: "./노래/92.mp3",
    id: 7,
  },
  {
    name: "pink skies",
    cover:
      "https://t2.genius.com/unsafe/848x0/https%3A%2F%2Fimages.genius.com%2Fb3e44319d732834c3dfee8790c091cfd.1000x1000x1.jpg",
    artist: "LANY",
    audio: "./노래/91.mp3",
    id: 8,
  },
  {
    name: "4EVER!",
    cover:
      "https://t2.genius.com/unsafe/848x0/https%3A%2F%2Fimages.genius.com%2Fafb62577ca647cbe14d7a8f5633f0e4b.500x500x1.jpg",
    artist: "LANY",
    audio: "./노래/90.mp3",
    id: 9,
  },
  {
    name: "Hurts",
    cover:
      "https://t2.genius.com/unsafe/848x0/https%3A%2F%2Fimages.genius.com%2Ff75e642ebf36e6b17ea5c0bbe7771112.1000x1000x1.jpg",
    artist: "LANY",
    audio: "./노래/89.mp3",
    id: 10,
  },
  {
    name: "Getting Over You",
    cover:
      "https://sterling-sound.com/wp-content/uploads/lauv.jpg",
    artist: "Lauv",
    audio: "./노래/88.mp3",
    id: 11,
  },
  {
    name: "Losing My Mind",
    cover:
      "https://image.bugsm.co.kr/album/images/350/5277/527746.jpg",
    artist: "Charlie Puth",
    audio: "./노래/87.mp3",
    id: 12,
  },
  {
    name: "Hands",
    cover:
      "https://image.bugsm.co.kr/album/images/500/203097/20309757.jpg",
    artist: "Hylynd",
    audio: "./노래/86.mp3",
    id: 13,
  },
  {
    name: "Wanted",
    cover:
      "https://img.discogs.com/AbJnZDHfW2lI9L3VeemOnDhIRRA=/fit-in/600x600/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-14100739-1567860262-9314.jpeg.jpg",
    artist: "OneRepublic",
    audio: "./노래/85.mp3",
    id: 14,
  },
   {
    name: "Don't Matter",
    cover:
      "https://assets.audiomack.com/jan-santos-1/a2cc22e915dfcebd84ca4bdd88d6ea6dd6aa298a9c9e5b1e6d532160590c0631.jpeg?width=1000&height=1000&max=true",
    artist: "Lauv",
    audio: "./노래/84.mp3",
    id: 15,
  },
  {
    name: "New York City",
    cover:
      "https://i1.sndcdn.com/artworks-000355163823-6dmfbp-t500x500.jpg",
    artist: "Owl City",
    audio: "./노래/41.mp3",
    id: 16,
  },
  {
    name: "Strawberry Avalanche",
    cover:
      "https://image.bugsm.co.kr/album/images/500/2168/216816.jpg",
    artist: "Owl City",
    audio: "./노래/42.mp3",
    id: 17,
  },
  {
    name: "The Bird And The Worm",
    cover:
      "https://images.genius.com/b86f9a4fde7d15cfdffcd6f61b7b82dc.900x900x1.jpg",
    artist: "Owl City",
    audio: "./노래/43.mp3",
    id: 18,
  },
  {
    name: "On The Wing",
    cover:
      "https://images.genius.com/b86f9a4fde7d15cfdffcd6f61b7b82dc.900x900x1.jpg",
    artist: "Owl City",
    audio: "./노래/44.mp3",
    id: 19,
  },
  {
    name: "Sunburn",
    cover:
      "https://images.genius.com/b86f9a4fde7d15cfdffcd6f61b7b82dc.900x900x1.jpg",
    artist: "Owl City",
    audio: "./노래/45.mp3",
    id: 20,
  },
  {
    name: "You’re Not Alone",
    cover:
      "https://i.scdn.co/image/ab67616d0000b273f12452fdb9e0b1422515b919",
    artist: "Owl City",
    audio: "./노래/46.mp3",
    id: 21,
  },
  {
    name: "I Found Love",
    cover:
      "https://image.genie.co.kr/Y/IMAGE/IMG_ALBUM/080/634/037/80634037_1436434701750_1_600x600.JPG/dims/resize/Q_80,0",
    artist: "Owl City",
    audio: "./노래/47.mp3",
    id: 22,
  },
  {
    name: "This Isn’t The End",
    cover:
      "https://image.genie.co.kr/Y/IMAGE/IMG_ALBUM/080/634/037/80634037_1436434701750_1_600x600.JPG/dims/resize/Q_80,0",
    artist: "Owl City",
    audio: "./노래/48.mp3",
    id: 23,
  },
  {
    name: "Fiji Water",
    cover:
      "https://i.scdn.co/image/ab67616d0000b273e401e74f2faf9dfbed8f7fcd",
    artist: "Owl City",
    audio: "./노래/49.mp3",
    id: 24,
  },
  {
    name: "Madeline Island",
    cover:
      "https://i1.sndcdn.com/artworks-000355163823-6dmfbp-t500x500.jpg",
    artist: "Owl City",
    audio: "./노래/50.mp3",
    id: 25,
  },
  {
    name: "Winners Never Quit",
    cover:
      "https://i1.sndcdn.com/artworks-000355163823-6dmfbp-t500x500.jpg",
    artist: "Owl City",
    audio: "./노래/61.mp3",
    id: 26,
  },
  {
    name: "Alligator Sky",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/2/22/Owl_City_-_Alligator_Sky.png",
    artist: "Owl City",
    audio: "./노래/62.mp3",
    id: 27,
  },
  {
    name: "Galaxies",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/5/58/Owl_City_Galaxies.jpg",
    artist: "Owl City",
    audio: "./노래/63.mp3",
    id: 28,
  },
  {
    name: "Summertime Sadness",
    cover:
      "https://i1.sndcdn.com/artworks-000338788569-fxot50-t500x500.jpg",
    artist: "Lana Del Rey",
    audio: "./노래/64.mp3",
    id: 29,
  },
  {
    name: "CRY",
    cover:
      "https://i1.sndcdn.com/artworks-xUPxfbVIsGsM-0-t500x500.jpg",
    artist: "Virginia To Vegas",
    audio: "./노래/65.mp3",
    id: 30,
  },
  {
    name: "Don't Fight The Music",
    cover:
      "https://m.media-amazon.com/images/I/91Cv53irYNL._SS500_.jpg",
    artist: "Virginia To Vegas",
    audio: "./노래/66.mp3",
    id: 31,
  },
  {
    name: "Polaroid",
    cover:
      "https://m.media-amazon.com/images/I/91Cv53irYNL._SS500_.jpg",
    artist: "Virginia To Vegas",
    audio: "./노래/67.mp3",
    id: 32,
  },
  {
    name: "Wasted",
    cover:
      "https://m.media-amazon.com/images/I/91Cv53irYNL._SS500_.jpg",
    artist: "Virginia To Vegas",
    audio: "./노래/68.mp3",
    id: 33,
  },
  {
    name: "Find Me",
    cover:
      "https://m.media-amazon.com/images/I/91Cv53irYNL._SS500_.jpg",
    artist: "Virginia To Vegas",
    audio: "./노래/69.mp3",
    id: 34,
  },
  {
    name: "Lovers Or Liars",
    cover:
      "https://i1.sndcdn.com/artworks-VCf2D3SAVJyy-0-t500x500.jpg",
    artist: "Lauren Aquilina",
    audio: "./노래/80.mp3",
    id: 35,
  },
  {
    name: "Can't Leave You Alone\n(feat. Juice WRLD)",
    cover:
      "https://i2.wp.com/corejamz.com/wp-content/uploads/2021/06/Maroon-5g.jpg?resize=678%2C678&ssl=1",
    artist: "Maroon 5",
    audio: "./노래/101.mp3",
    id: 36,
  },
  {
    name: "Echo (feat. blackbear)",
    cover:
      "https://i2.wp.com/corejamz.com/wp-content/uploads/2021/06/Maroon-5g.jpg?resize=678%2C678&ssl=1",
    artist: "Maroon 5",
    audio: "./노래/102.mp3",
    id: 37,
  },
 
  {
    name: "One Light (feat. Bantu)",
    cover:
      "https://i2.wp.com/corejamz.com/wp-content/uploads/2021/06/Maroon-5g.jpg?resize=678%2C678&ssl=1",
    artist: "Maroon 5",
    audio: "./노래/105.mp3",
    id: 38,
  },
  {
    name: "Nobody's Love",
    cover:
      "https://i2.wp.com/corejamz.com/wp-content/uploads/2021/06/Maroon-5g.jpg?resize=678%2C678&ssl=1",
    artist: "Maroon 5",
    audio: "./노래/106.mp3",
    id: 39,
  },
  {
    name: "Dancing in the kitchen",
    cover:
      "https://i.scdn.co/image/ab67616d0000b27344bdc09715b571735ac35b2d",
    artist: "Lany",
    audio: "./노래/107.m4a",
    id: 40,
  },
  {
    name: "roll over, baby",
    cover:
      "https://image.genie.co.kr/Y/IMAGE/IMG_ALBUM/082/208/769/82208769_1629735965272_1_600x600.JPG/dims/resize/Q_80,0",
    artist: "LANY",
    audio: "./노래/109.mp3",
    id: 41,
  },
 
   
   
 
];
