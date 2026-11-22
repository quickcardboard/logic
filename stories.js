// The story library. Each story is a book: a list of chapters. A chapter has story pages to read and,
// optionally, a puzzle page (an id from puzzles/book or puzzles/tutorial). Solving a puzzle unlocks the pages after it.
// A page is { text: [paragraphs] }. Story pages are words only: the first picture in a book is its first map.
// theme sets each book's own colours, so every story can have its own look (school, dinosaurs, space...).
window.STORIES = [
  {
    id: "duck",
    title: "The Rubber Duck Bandit",
    spine: "#ffc53d",
    ink: "#3d2c00",
    theme: { accent: "#ffc53d", accentInk: "#3d2c00", soft: "#fff3c4" },
    cover: "duck",
    ages: "Ages 7 to 10",
    teaser: "On the day of the fiftieth Great Duck Race, the Golden Duck trophy turns out to be a rubber duck painted gold. Two kid detectives, one hamster and you, the map-reader, have one hour to rebuild the day and find out who swapped it.",
    pdf: "pdf/the-rubber-duck-bandit.pdf",
    chapters: [
      {
        id: "prologue", title: "Friday, 2:30: The Golden Duck",
        pages: [
          { text: [
            "Nothing exciting ever happens at Wobbleton Elementary.",
            "Except for one day a year: the Great Duck Race. Every kid in school races a rubber duck down Wobbleton Stream, and the winner gets to hold up the Golden Duck, a trophy made of real gold.",
            "This year is the fiftieth race. So this year, the winner gets to keep the Golden Duck forever."] },
          { text: [
            "Mo Pickles and Zara Quinn are detectives. They have a magnifying glass, a notebook and a hamster called Sergeant Nibbles.",
            "They have solved zero cases.",
            "Mo has been training his race duck, Speedy McQuack, all week. \"Today,\" he said, \"that Golden Duck is MINE.\""] },
          { text: [
            "At 2:30, the whole school squeezed into the Hall. Principal Plumpton had just got back from a meeting in town. He fetched the key from its hook in the Office and unlocked the Trophy Cabinet.",
            "He lifted out the Golden Duck. Everybody cheered.",
            "SQUEAK.",
            "The principal looked down. It wasn't gold. It was an ordinary rubber duck, painted gold. The paint was still sticky."] },
          { text: [
            "\"Someone has STOLEN the Golden Duck!\" squeaked the principal. \"No Golden Duck, no race!\"",
            "\"The Rubber Duck Bandit strikes!\" said Mo.",
            "Zara's hand shot up. \"We're detectives, sir. Give us until the race starts at 3:30.\"",
            "The principal looked at the clock. \"One hour. Not one minute more.\"",
            "Zara opened her notebook. \"To find out when the duck was swapped, we need to rebuild the whole day.\" Then she looked up at you. \"We need a map-reader. Someone good at working out who was where. Are you in?\""] },
        ],
      },
      {
        id: "duck1", title: "Chapter 1: 8:30, The Polished Glass", puzzle: "duck1",
        pages: [
          { text: [
            "\"First question,\" said Zara. \"When did anyone last see the REAL Golden Duck?\"",
            "The grown-ups had all come in early that morning to get ready for the race. Zara asked each of them where they were at 8:30.",
            "Coach Cherry blew his whistle. TWEEEET! \"I WAS AT A CROSSROADS! AND I WASN'T IN THE HALL!\"",
            "Mr. Blueberry the caretaker leaned on his mop. \"I wasn't in the Kitchen. I was right next to the Hall.\""] },
          { text: [
            "\"Shhh,\" said Ms. Peapod the librarian. \"I was right next to the Toilets.\"",
            "Mrs. Lavender the lunch lady hummed. \"I was right next to the Hall, dear.\"",
            "Mo narrowed his eyes. \"Coach Cherry wants his class to win that duck SO badly. It was HIM!\"",
            "\"He wants to WIN it, Mo,\" said Zara. \"Not steal it.\""] },
          { text: [
            "Zara found two clues. There was a fresh smear of polish on the Trophy Cabinet's glass, so someone had been there. And the Office stayed locked until 9:00, so nobody was in the Office.",
            "She turned the map to you. \"Where was everyone at 8:30? And who was at the Trophy Cabinet?\""] },
        ],
      },
      {
        id: "duck2", title: "Chapter 2: 10:15, The Key on the Hook", puzzle: "duck2",
        pages: [
          { text: [
            "Mr. Blueberry had been at the Trophy Cabinet, polishing the glass. \"The Golden Duck was the real one at 8:30,\" he said. \"Shiny and heavy. I polish it every Friday.\"",
            "\"Could you open the cabinet?\" asked Zara.",
            "\"Not me. There's only one key, and it hangs on a hook in the Office.\"",
            "Zara wrote: Real at 8:30. Only one key, in the Office. Sergeant Nibbles was promoted to Captain Nibbles for not eating the notebook."] },
          { text: [
            "On the way to the Office, they cut through the library.",
            "On the wall hung a very old photo of a tiny girl with big glasses, holding up the Golden Duck and grinning from ear to ear. The name under the photo had been torn off.",
            "\"Who's that?\" asked Mo.",
            "Ms. Peapod looked up from her desk. \"Shhh,\" she said."] },
          { text: [
            "The key hook was right by the Office window.",
            "\"The thief needed that key,\" said Zara. \"The Office is empty at recess. Let's find out where everyone was at 10:15.\"",
            "\"I WAS RIGHT NEXT TO THE WATER FOUNTAIN!\" said Coach Cherry.",
            "\"I was at a crossroads,\" said Mr. Blueberry.",
            "\"Shhh,\" said Ms. Peapod. \"Mr. Blueberry was right next to me.\"",
            "\"I was right next to the Bike Shed, dear,\" said Mrs. Lavender."] },
          { text: [
            "Zara found three clues. The Office door was shut, and nobody was inside. Somebody had drawn a chalk rainbow on the Front Steps, and nobody had smudged it. And there were big grown-up boot prints in the Mud Patch.",
            "\"Who was right next to the Office at recess?\" she asked you. \"They might have seen who took the key.\""] },
        ],
      },
      {
        id: "duck3", title: "Chapter 3: 12:30, The Gold Paint", puzzle: "duck3",
        pages: [
          { text: [
            "Mrs. Lavender had been in the Kitchen, right next to the Office. She had been peeling potatoes by the hatch.",
            "\"Nobody went into the Office, dear,\" she said. \"And the key was still on its hook when the bell rang at 10:30.\"",
            "\"So the duck was swapped after 10:30,\" said Zara.",
            "Mo pointed at a little pot on the counter. \"GOLD PAINT!\" \"Edible gold, dear,\" said Mrs. Lavender. \"For the race cake.\" Captain Nibbles was promoted to Major Nibbles for licking it."] },
          { text: [
            "Zara sniffed the fake duck. \"This isn't cake paint. It's the gold paint from the Art Room.\"",
            "At lunchtime the kids had eaten outside in the sunshine, so the school had been quiet. Zara asked the grown-ups where they had been at 12:30.",
            "\"I WAS CLOSER TO THE ART ROOM THAN MS. PEAPOD WAS!\" said Coach Cherry.",
            "\"I was at a dead end,\" said Mr. Blueberry."] },
          { text: [
            "\"Shhh,\" said Ms. Peapod. \"For once, I wasn't in the Library. And Mrs. Lavender and I were two paths apart.\"",
            "\"I was right next to the Staff Room, dear,\" said Mrs. Lavender.",
            "Mo spun round. \"MR. BLUEBERRY! He has keys to EVERYTHING!\"",
            "\"Except the Trophy Cabinet,\" said Zara. \"Remember?\""] },
          { text: [
            "Zara found three clues. On the Art Room floor was a sprinkle of gold glitter, with no footprints in it. In the Hall, a giant GOOD LUCK, DUCKS! banner lay drying, and the wet paint had no footprints either. And in the Gym, a basketball was still bouncing.",
            "\"Who was right next to the Art Room?\" she asked you. \"They might have seen that gold paint.\""] },
        ],
      },
      {
        id: "duck4", title: "Chapter 4: 11:00, The Swap", puzzle: "duck4",
        pages: [
          { text: [
            "Coach Cherry had been in the Changing Room, right next to the Art Room. \"I SAW IT THROUGH THE DOOR! THE GOLD PAINT POT WAS OPEN!\" he said. \"AND WHEN I WALKED PAST THE TROPHY CABINET AT 12:00, THE GOLDEN DUCK LOOKED... WET!\"",
            "\"So it was swapped after 10:30, but before 12:00,\" said Zara. Major Nibbles was promoted to Colonel Nibbles for sitting very still."] },
          { text: [
            "Zara ran to the school timetable on the wall. \"The Hall always has a class in it,\" she said. \"Except at 11:00. At 11:00, the whole school was in the Gym, decorating ducks for the race.\"",
            "\"So the Hall was empty,\" said Mo.",
            "\"Empty,\" said Zara. \"Except for the thief.\"",
            "It was 3:20. Ten minutes left. Zara asked the grown-ups one last time: where were you at 11:00?"] },
          { text: [
            "Coach Cherry blew his whistle. TWEEEET! \"I WAS AT A CROSSROADS!\"",
            "Mr. Blueberry wrung out his mop. \"I wasn't in the Library. I was right next to the Gym.\"",
            "\"Coach Cherry was right next to me, dear,\" said Mrs. Lavender.",
            "Ms. Peapod straightened her glasses. \"Shhh,\" she whispered. \"I was right next to the Stage.\""] },
          { text: [
            "\"It's KEVIN!\" said Mo.",
            "\"Kevin was in the Gym with us,\" said Zara. \"Gluing googly eyes on his duck.\"",
            "\"Seventeen googly eyes,\" said Kevin proudly.",
            "Zara found three clues. In front of the Trophy Cabinet was a drop of gold paint with half a grown-up shoe print in it. The Hall had been empty, with not a single chair out. And in the Gym, a grown-up had been handing out googly eyes.",
            "She turned the map to you. \"Quick! Who was at the Trophy Cabinet at 11:00?\""] },
        ],
      },
      {
        id: "ending", title: "The Bandit Unmasked",
        pages: [
          { text: [
            "Coach Cherry had been in the Gym. Mr. Blueberry was in the Art Room. Mrs. Lavender was in the Library, returning a cookbook.",
            "That left one grown-up at the Trophy Cabinet.",
            "Everybody turned to look at Ms. Peapod. On the bottom of her shoe was a smudge of gold paint."] },
          { text: [
            "\"But you said you were right next to the Stage!\" said Mo.",
            "\"I was,\" said Ms. Peapod quietly. \"The Trophy Cabinet is right next to the Stage.\"",
            "Ms. Peapod had never told a single fib. She just hadn't told the whole story.",
            "\"After recess, you took the key from the Office,\" said Zara. \"At 11:00, when everyone was in the Gym, you swapped the ducks. Then you put the key back.\""] },
          { text: [
            "Zara thought about the old photo in the library. The tiny girl with the big glasses.",
            "\"That's you,\" she said. \"You won the very first Great Duck Race.\"",
            "Ms. Peapod nodded. \"I was the shyest girl in the whole school. Nobody ever noticed me. Then my little duck won, and everybody cheered my name.\" She sniffed. \"If someone takes the Golden Duck home today, it will be gone from our school forever.\""] },
          { text: [
            "She walked to the library, reached behind the big dictionary, and took out the real Golden Duck. It shone like the sun.",
            "Principal Plumpton looked at it for a long time. \"Ms. Peapod is right,\" he said at last. \"The Golden Duck belongs to everyone. From now on, it stays here, and every winner gets their name on it.\"",
            "\"And Ms. Peapod,\" he added, \"will hand it out.\"",
            "For the first time anyone could remember, Ms. Peapod didn't say \"Shhh.\" She cheered."] },
          { text: [
            "At 3:30 on the dot, three hundred rubber ducks raced down Wobbleton Stream. Speedy McQuack came last. Kevin's duck, with seventeen googly eyes, came first.",
            "That night, Zara wrote in her notebook: Pickles & Quinn Investigations. Cases solved: one.",
            "Mo added underneath: With help from our map-reader.",
            "And Colonel Nibbles was promoted to General Nibbles, for being there the whole time.",
            "THE END"] },
        ],
      },
    ],
  },
  {
    id: "tutorial",
    title: "How to Play",
    spine: "#3fa31a",
    ink: "#ffffff",
    theme: { accent: "#3a9a12", accentInk: "#ffffff", soft: "#e5f6da" },
    teaser: "New here? A tiny case with Mo and Zara shows you, one step at a time, how to read the map, use the evidence and place each person.",
    chapters: [{ id: "tutorial", title: "Tutorial: Who Was Where at 8:30?", puzzle: "tutorial", pages: [] }],
  },
  { id: "soon1", title: "Coming soon", spine: "#2fbf9b", ink: "#ffffff", soon: true, badge: "🦕", teaser: "A dinosaur mystery is on its way." },
  { id: "soon2", title: "Coming soon", spine: "#5b5bd6", ink: "#ffffff", soon: true, badge: "🚀", teaser: "A mystery in space is on its way." },
];
