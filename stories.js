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
    teaser: "On the day of the fiftieth Great Duck Race, the Golden Duck trophy turns out to be a rubber duck painted gold. Two kid detectives and one hamster have one hour to rebuild the day and find out who swapped it.",
    pdf: "pdf/the-rubber-duck-bandit.pdf",
    chapters: [
      {
        id: "prologue", title: "Friday, 2:30: The Golden Duck",
        pages: [
          { text: [
            "Nothing exciting ever happens at Wobbleton Elementary, and this is not great for business."] },
          { text: [
            "Mo Pickles and Zara Quinn sat in the cafeteria behind a small cardboard sign that said \"Mo and Zara Consulting Services\". Below the title, the price of $10 had been crossed out and replaced with \"Free\"."] },
          { text: [
            "They are detectives. They have a magnifying glass, a notebook, and a hamster called Sergeant Nibbles. They have solved zero cases."] },
          { text: [
            "\"Today is going to be different,\" said Zara, chewing her PB and J.",
            "\"Because I'm going to win the race?\" Mo replied, fidgeting with his rubber duck, Speedy McQuack."] },
          { text: [
            "Today is the most exciting day of the school year. It's the Great Duck Race. Every kid in school races a rubber duck down Wobbleton Stream. The winner gets to hold up the Golden Duck, a trophy made of real gold, as the legend says."] },
          { text: [
            "This year is the fiftieth race. So this year, the winner gets to keep the Golden Duck forever.",
            "\"Today, that Golden Duck is MINE!\" said Mo confidently."] },
          { text: [
            "At 2:30, the whole school squeezed into the Hall to begin the festivities. Principal Plumpton had just got back from a meeting in town. He had just fetched the trophy cabinet key from its hook in the Office. He unlocked the Trophy Cabinet in front of the crowd and reached in for the Golden Duck."] },
          { text: [
            "He lifted out the Golden Duck. Everybody cheered.",
            "SQUEAK."] },
          { text: [
            "The principal looked down. It wasn't gold. It was an ordinary rubber duck, painted gold. The paint was still sticky."] },
          { text: [
            "\"Someone has STOLEN the Golden Duck!\" squeaked the principal. \"No Golden Duck, no race!\"",
            "\"The Rubber Duck Bandit strikes!\" said Mo."] },
          { text: [
            "Zara's hand shot up. \"We're detectives, sir. Give us until the race starts at 3:30.\"",
            "The principal shot them a quizzical look and glanced at the clock. \"One hour. Not one minute more.\""] },
          { text: [
            "Zara opened her notebook. \"To find out when the duck was swapped, we need to rebuild the whole day.\""] },
        ],
      },
      {
        id: "duck1", title: "Chapter 1: 8:30, The Polished Glass", puzzle: "duck1",
        pages: [
          { text: [
            "\"First question,\" said Zara. \"When did anyone last see the REAL Golden Duck?\""] },
          { text: [
            "The grown-ups had all come in early that morning to get ready for the race. Zara asked each of them where they were at 8:30."] },
          { text: [
            "Coach Cherry blew his whistle. TWEEEET! \"I CAN'T REMEMBER, BUT I WAS DEFINITELY AT A PLACE WITH THREE OR MORE PATHS, AND I DEFINITELY WAS NOT IN THE HALL!\""] },
          { text: [
            "Mr. Blueberry the caretaker leaned on his mop. \"I wasn't in the Kitchen. I know I was right next to the Hall.\"",
            "\"Shhh,\" said Ms. Peapod the librarian. \"I was right next to the Toilets.\"",
            "Mrs. Lavender the lunch lady hummed. \"I was right next to the Hall, dear.\""] },
          { text: [
            "Mo narrowed his eyes. \"Coach Cherry wants his class to win that duck SO badly. It was HIM!\"",
            "\"He wants to WIN it, Mo,\" said Zara. \"Not steal it.\""] },
          { text: [
            "Zara found two clues. Kevin's bus had dropped him off at 8:30, and through the front window he saw a grown-up polishing the Trophy Cabinet. \"The sun was in my eyes,\" he said, \"so I couldn't see who.\""] },
          { text: [
            "And the Office is always locked until Mrs. Dot the office lady arrives at 9:00, so nobody was in the Office."] },
        ],
      },
      {
        id: "duck2", title: "Chapter 2: 10:15, The Key on the Hook", puzzle: "duck2",
        pages: [
          { text: [
            "Mr. Blueberry had been at the Trophy Cabinet, polishing the glass."] },
          { text: [
            "\"Oh yeah, that's where I was. The Golden Duck was the real one at 8:30,\" he said. \"It shimmered like gold, not gold paint.\"",
            "\"Could you open the cabinet?\" asked Zara.",
            "\"Not me. There's only one key, and it hangs on a hook in the Office.\""] },
          { text: [
            "Zara wrote: <i>Real at 8:30. Only one key, in the Office.</i>",
            "Sergeant Nibbles was promoted to Captain Nibbles for not eating the notebook."] },
          { text: [
            "On the way to the Office, they cut through the library. On the wall hung a very old photo of a tiny girl with big glasses, holding up the Golden Duck and grinning from ear to ear. The name under the photo had been torn off."] },
          { text: [
            "\"Who's that?\" asked Mo loudly.",
            "Ms. Peapod looked up from her desk. \"Shhh,\" she said.",
            "The key hook was right by the Office window."] },
          { text: [
            "\"The thief needed that key,\" said Zara. \"The Office is empty at recess. Let's find out where everyone was at 10:15.\""] },
          { text: [
            "\"I WAS RIGHT NEXT TO THE WATER FOUNTAIN!\" said Coach Cherry.",
            "\"I was at a place with three or more paths,\" said Mr. Blueberry."] },
          { text: [
            "\"Shhh,\" said Ms. Peapod. \"Mr. Blueberry was right next to me.\"",
            "\"I was right next to the Bike Shed, dear,\" said Mrs. Lavender."] },
          { text: [
            "Zara found three clues. Mrs. Dot locks the Office at recess while she has her cup of tea, so nobody was in the Office."] },
          { text: [
            "Year 2 had spent the whole of recess drawing a giant chalk rainbow on the Front Steps. \"No grown-ups came near us,\" said a girl with chalky hands.",
            "And the Year 3 kids playing tag had seen a grown-up in big boots stomping about in the Mud Patch."] },
          { text: [
            "\"Who was right next to the Office at recess?\" Zara asked herself. \"They might have seen who took the key.\""] },
        ],
      },
      {
        id: "duck3", title: "Chapter 3: 12:30, The Gold Paint", puzzle: "duck3",
        pages: [
          { text: [
            "Mrs. Lavender had been in the Kitchen, right next to the Office. She had been peeling potatoes by the hatch."] },
          { text: [
            "\"Nobody went into the Office, dear,\" she said. \"And the key was still on its hook when the bell rang at 10:30.\"",
            "\"So the duck was swapped after 10:30,\" said Zara."] },
          { text: [
            "Mo pointed at a little pot on the counter. \"Aha, GOLD PAINT!\"",
            "\"Edible gold, dear,\" said Mrs. Lavender. \"For the race cake.\""] },
          { text: [
            "Captain Nibbles was promoted to Major Nibbles for licking it.",
            "Zara sniffed the fake duck. \"This isn't cake paint. It's the gold paint from the Art Room.\""] },
          { text: [
            "At lunchtime most of the kids had eaten outside in the sunshine, so the school had been quiet. Zara asked the grown-ups where they had been at 12:30."] },
          { text: [
            "\"I WAS CLOSER TO THE ART ROOM THAN MS. PEAPOD WAS!\" said Coach Cherry.",
            "\"I was at a dead end,\" said Mr. Blueberry."] },
          { text: [
            "\"Shhh,\" said Ms. Peapod. \"For once, I wasn't in the Library. And Mrs. Lavender and I were two paths apart.\"",
            "\"I was right next to the Staff Room, dear,\" said Mrs. Lavender."] },
          { text: [
            "Mo spun round. \"MR. BLUEBERRY! He has keys to EVERYTHING!\"",
            "\"Except the Trophy Cabinet,\" said Zara. \"Remember?\""] },
          { text: [
            "Zara found three clues. Priya had run back to the Art Room at 12:30 for her forgotten lunchbox. \"Nobody was in there,\" she said."] },
          { text: [
            "Mrs. Dot locks the Hall at lunch, so nobody was in the Hall.",
            "And the kids eating on the field at 12:30 had heard a basketball going THUMP, THUMP, THUMP through the open Gym window."] },
          { text: [
            "\"Who was right next to the Art Room?\" Zara asked herself. \"They might have seen someone take the gold paint.\""] },
        ],
      },
      {
        id: "duck4", title: "Chapter 4: 11:00, The Swap", puzzle: "duck4",
        pages: [
          { text: [
            "Coach Cherry had been in the Changing Room, right next to the Art Room."] },
          { text: [
            "\"I SAW IT THROUGH THE DOOR! THE GOLD PAINT POT WAS OPEN!\" he said. \"AND WHEN I WALKED PAST THE TROPHY CABINET AT 12:00, THE GOLDEN DUCK LOOKED... WET!\"",
            "\"So it was swapped after 10:30, but before 12:00,\" said Zara."] },
          { text: [
            "Major Nibbles was promoted to Colonel Nibbles for sitting very still."] },
          { text: [
            "Zara ran to the school timetable on the wall. \"In lesson time, the Hall always has a class in it,\" she said. \"Except at 11:00. At 11:00, the whole school was in the Gym, decorating ducks for the race.\""] },
          { text: [
            "\"So the Hall was empty,\" said Mo.",
            "\"Empty,\" said Zara. \"The perfect time to sneak past it to the Trophy Cabinet.\""] },
          { text: [
            "It was 3:20. Ten minutes left. Zara asked the grown-ups one last time: where were you at 11:00?"] },
          { text: [
            "Coach Cherry blew his whistle. TWEEEET! \"I WAS AT A PLACE WITH THREE OR MORE PATHS!\"",
            "Mr. Blueberry wrung out his mop. \"I wasn't in the Library. I was right next to the Gym.\""] },
          { text: [
            "\"Coach Cherry was right next to me, dear,\" said Mrs. Lavender.",
            "Ms. Peapod straightened her glasses. \"Shhh,\" she whispered. \"I was right next to the Stage.\""] },
          { text: [
            "\"It's KEVIN!\" said Mo.",
            "\"Kevin was in the Gym with us,\" said Zara. \"Gluing googly eyes on his duck.\"",
            "\"Seventeen googly eyes,\" said Kevin proudly."] },
          { text: [
            "Zara found three clues. In front of the Trophy Cabinet was a drop of gold paint, with half a grown-up shoe print in it."] },
          { text: [
            "Mrs. Dot locks the Hall whenever no class is booked, so nobody was in the Hall.",
            "And every kid in the Gym remembered a grown-up dressed as a duck, handing out googly eyes."] },
          { text: [
            "Zara thought. \"Who was at the Trophy Cabinet at 11:00?\""] },
        ],
      },
      {
        id: "ending", title: "The Bandit Unmasked",
        pages: [
          { text: [
            "Coach Cherry had been in the Gym. Mr. Blueberry was in the Art Room. Mrs. Lavender was in the Library, returning a cookbook."] },
          { text: [
            "That left one grown-up at the Trophy Cabinet.",
            "Everybody turned to look at Ms. Peapod. On the bottom of her shoe was a smudge of gold paint."] },
          { text: [
            "\"But you said you were right next to the Stage!\" said Mo.",
            "\"I was,\" said Ms. Peapod quietly. \"The Trophy Cabinet is right next to the Stage.\"",
            "Ms. Peapod smiled guiltily."] },
          { text: [
            "\"At 11:00, everyone was in the Gym, even Mrs. Dot, who was judging the ducks,\" said Zara. \"So you took the key from the empty Office, swapped the ducks, and put the key back.\""] },
          { text: [
            "Zara thought about the old photo in the library. The tiny girl with the big glasses.",
            "\"That's you,\" she said. \"You won the very first Great Duck Race.\""] },
          { text: [
            "Ms. Peapod nodded. \"I was the shyest girl in the whole school. Nobody ever noticed me. Then my little duck won, and everybody cheered my name.\"",
            "She sniffed. \"If someone takes the Golden Duck home today, it will be gone from our school forever.\""] },
          { text: [
            "She walked to the library, reached behind the big dictionary, and took out the real Golden Duck. It shone like the sun."] },
          { text: [
            "Principal Plumpton looked at it for a long time. \"Ms. Peapod is right,\" he said at last. \"The Golden Duck belongs to everyone. From now on, it stays here, and every winner gets their name below it on a plaque.\""] },
          { text: [
            "\"And Ms. Peapod,\" he added, \"will hand it out.\"",
            "For the first time anyone could remember, Ms. Peapod didn't say \"Shhh.\" She cheered."] },
          { text: [
            "At 3:30 on the dot, three hundred rubber ducks raced down Wobbleton Stream. Speedy McQuack came last. Kevin's duck, who started the race with seventeen googly eyes, came first, finishing with one eye."] },
          { text: [
            "That night, Zara wrote in her notebook: <i>Mo and Zara Consulting Services. Cases solved: one.</i>",
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
