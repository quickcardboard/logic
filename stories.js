// The story library. Each story is a book: a list of chapters. A chapter has story pages to read and,
// optionally, a puzzle page (an id from puzzles/book or puzzles/tutorial). Solving a puzzle unlocks the pages after it.
// A page is { art, text: [paragraphs] }. art is "place:<spot id>" or "duck". Portraits only appear on puzzle pages.
// theme sets each book's own colours, so every story can have its own look (school, dinosaurs, space...).
window.STORIES = [
  {
    id: "duck",
    title: "The Rubber Duck Bandit",
    spine: "#ffc53d",
    ink: "#3d2c00",
    theme: { accent: "#ffc53d", accentInk: "#3d2c00", soft: "#fff3c4", sky: "#dff3ff", paper: "#fffdf6" },
    cover: "duck",
    ages: "Ages 7 to 10",
    teaser: "Three thousand rubber ducks burst out of the principal's office. A note promises one prank a day until Friday. Two kid detectives, one hamster and you, the map-reader, have five days to catch the Bandit.",
    pdf: "pdf/the-rubber-duck-bandit.pdf",
    chapters: [
      {
        id: "prologue", title: "Monday: Ducks. So Many Ducks.",
        pages: [
          { art: "place:class", text: [
            "Nothing exciting ever happens at Wobbleton Elementary.",
            "This is a problem for Mo Pickles and Zara Quinn, because they are detectives. They have a magnifying glass, a notebook and a hamster called Sergeant Nibbles.",
            "They have solved zero cases."] },
          { art: "place:hall", text: [
            "On Monday, Principal Plumpton called the whole school into the hall. \"This Friday, our lunch lady Mrs. Purple retires after FIFTY YEARS of fish sticks!\"",
            "Everybody clapped. Mrs. Purple waved her ladle and hummed.",
            "Then the principal unlocked his office door with his very own key. He pulled."] },
          { art: "duck", text: [
            "SQUEAK. SQUEAK SQUEAK SQUEAKSQUEAKSQUEAK.",
            "Three thousand rubber ducks poured out.",
            "Taped to the biggest duck was a note: QUACK QUACK! THE RUBBER DUCK BANDIT STRIKES! ONE PRANK A DAY UNTIL FRIDAY."] },
          { art: "place:office", text: [
            "\"Who did this?\" squeaked Principal Plumpton. A duck squeaked back.",
            "Mo's hand shot up. \"We're detectives, sir! We'll catch the Bandit!\"",
            "The principal sighed the biggest sigh in history. \"Fine. By Friday.\"",
            "Zara wrote in her notebook: Day 1. 3,000 ducks. The office was locked. Who has a key? Then she looked up at you. \"We need a map-reader. Someone good at working out who was where. Are you in?\""] },
        ],
      },
      {
        id: "duck1", title: "Chapter 1: The Great Bathtub Splash", puzzle: "duck1",
        pages: [
          { art: "place:bikeshed", text: [
            "Tuesday, 10:14. Every day at recess, Principal Plumpton takes his coffee walk round the playground.",
            "Mo and Zara were on the school steps, watching for anything suspicious.",
            "\"Nothing suspicious,\" said Mo. \"Nothing suspicious. Nothing suspi... WHAT IS THAT ON THE ROOF?\""] },
          { art: "place:fountain", text: [
            "SPLOOOOOSH!",
            "A bathtub of cold water and forty rubber ducks landed on Principal Plumpton. A rope dangled down the back of the shed, but nobody was there. Just a duck with a note: QUACK! DAY 2!",
            "\"PICKLES! QUINN!\" spluttered the principal. \"FIND! THAT! BANDIT!\""] },
          { art: "place:staff", text: [
            "\"Three grown-ups were on playground duty,\" said Zara. \"One of them might have seen something.\"",
            "Coach Red blew his whistle. TWEEEET! \"I WAS RIGHT NEXT TO THE VEGETABLE GARDEN!\"",
            "Mr. Blue leaned on his mop. \"I was at a crossroads. Three paths or more.\"",
            "Ms. Green put a finger to her lips. \"Shhh. I was not at the Water Fountain.\""] },
          { art: "place:mud", text: [
            "\"I've cracked it!\" said Mo. \"It was Kevin Dimbleby!\" \"Kevin was eating crackers next to us,\" said Zara. \"Suspicious crackers,\" said Mo.",
            "Outside, Zara found two clues. The Bell Cupboard padlock still had its cobweb, so nobody had been in there. And there were big grown-up boot prints in the Mud Patch.",
            "She turned the map to you. \"Where was everyone at 10:15? And who was right next to the Bike Shed?\""] },
        ],
      },
      {
        id: "duck2", title: "Chapter 2: The Flag Fiasco", puzzle: "duck2",
        pages: [
          { art: "place:frame", text: [
            "Mr. Blue had been at the Climbing Frame, right next to the Bike Shed. \"Nobody was behind that shed,\" he said. \"The rope went tight all by itself, just as the principal walked past.\"",
            "Zara wrote it down. Mo decided the Bandit was a ghost.",
            "Sergeant Nibbles was promoted to Captain Nibbles for not getting wet."] },
          { art: "place:flagpole", text: [
            "On Wednesday, everyone was careful. Kevin checked his chair for ducks. Coach Red checked his whistle for ducks. Mo checked his sandwich for ducks.",
            "At 9:00 exactly, the fire alarm went off. BRRRRING!",
            "Everyone hurried outside. Everyone looked up. The school flag was gone. In its place flapped a giant yellow duck that said QUACK! DAY 3!",
            "\"PICKLES!\" bellowed Principal Plumpton. \"QUINN!\" \"We know, sir,\" said Zara. \"Find that Bandit.\""] },
          { art: "place:kitchen", text: [
            "Four grown-ups were still inside when the alarm rang. Zara wrote down what each one said.",
            "Coach Red: TWEEEET! \"MR. BLUE WAS RIGHT NEXT TO ME!\" Mr. Blue: \"I was at a crossroads. It's the pipes, you know.\" Ms. Green: \"Shhh. I was right next to the Front Door.\"",
            "Mrs. Purple hummed and stirred. \"Ms. Green and I were two paths apart, dear.\""] },
          { art: "place:hall", text: [
            "Mo gasped. \"She's HUMMING! The Bandit is MRS. PURPLE!\" \"Mrs. Purple always hums,\" said Zara. \"So do you.\" \"...Hmm,\" said Mo.",
            "Zara found three clues. The Hall floor was freshly mopped, with no footprints. The grass by the Flagpole was wet with dew, with no footprints. And in the Toilets, the paper roll was still spinning.",
            "\"Who was right next to the Flagpole?\" she asked you. \"They might have seen who pulled the rope.\""] },
        ],
      },
    ],
  },
  {
    id: "tutorial",
    title: "How to Play",
    spine: "#58cc02",
    ink: "#ffffff",
    theme: { accent: "#58cc02", accentInk: "#ffffff", soft: "#e5f8d4", sky: "#e3f6ff", paper: "#ffffff" },
    teaser: "New here? A tiny case with Mo and Zara shows you, one step at a time, how to read the map, use the evidence and place each person.",
    chapters: [{ id: "tutorial", title: "Tutorial: Who Was Where at 8:30?", puzzle: "tutorial", pages: [] }],
  },
  { id: "soon1", title: "Coming soon", spine: "#2fbf9b", ink: "#ffffff", soon: true, badge: "🦕", teaser: "A dinosaur mystery is on its way." },
  { id: "soon2", title: "Coming soon", spine: "#5b5bd6", ink: "#ffffff", soon: true, badge: "🚀", teaser: "A mystery in space is on its way." },
];
