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
    teaser: "Three thousand rubber ducks burst out of the principal's office. A note promises one prank a day until Friday. Two kid detectives, one hamster and you, the map-reader, have five days to catch the Bandit.",
    pdf: "pdf/the-rubber-duck-bandit.pdf",
    chapters: [
      {
        id: "prologue", title: "Monday: Ducks. So Many Ducks.",
        pages: [
          { text: [
            "Nothing exciting ever happens at Wobbleton Elementary.",
            "This is a problem for Mo Pickles and Zara Quinn, because they are detectives. They have a magnifying glass, a notebook and a hamster called Sergeant Nibbles.",
            "They have solved zero cases."] },
          { text: [
            "On Monday, Principal Plumpton called the whole school into the hall. \"This Friday, our lunch lady, Mrs. Lavender, retires after FIFTY YEARS of fish sticks!\"",
            "Everybody clapped. Mrs. Lavender waved her ladle and hummed.",
            "After assembly, the principal unlocked his office door with his very own key. He pulled."] },
          { text: [
            "SQUEAK. SQUEAK SQUEAK. SQUEAKSQUEAKSQUEAK.",
            "Three thousand rubber ducks poured out.",
            "Taped to the biggest duck was a note: QUACK QUACK! THE RUBBER DUCK BANDIT STRIKES! ONE PRANK A DAY UNTIL FRIDAY."] },
          { text: [
            "\"Who did this?\" squeaked Principal Plumpton. A duck squeaked back.",
            "Mo's hand shot up. \"We're detectives, sir! We'll catch the Bandit!\"",
            "The principal sighed the biggest sigh in history. \"Fine. By Friday.\"",
            "Zara opened her notebook and wrote: Day 1. 3,000 ducks. The office was locked. Who has a key?",
            "Then she looked up at you. \"We need a map-reader. Someone good at working out who was where. Are you in?\""] },
        ],
      },
      {
        id: "duck1", title: "Chapter 1: The Great Bathtub Splash", puzzle: "duck1",
        pages: [
          { text: [
            "Tuesday, 10:14. Every day at recess, Principal Plumpton takes his coffee for a walk round the playground.",
            "Mo and Zara sat on the school steps, watching for anything suspicious.",
            "\"Nothing suspicious,\" said Mo. \"Nothing suspicious. Nothing suspi... WHAT IS THAT ON THE BIKE SHED?\""] },
          { text: [
            "SPLOOOOOSH!",
            "A bathtub of cold water and forty rubber ducks tipped off the roof and landed on Principal Plumpton.",
            "A rope hung down the back of the shed to the path, but nobody was holding it. There was just a duck with a note: QUACK! DAY 2!",
            "\"PICKLES! QUINN!\" spluttered the principal. \"FIND! THAT! BANDIT!\""] },
          { text: [
            "Three grown-ups had been on playground duty. Zara asked each of them where they were when the bathtub tipped.",
            "Coach Cherry blew his whistle. TWEEEET! \"I WAS RIGHT NEXT TO THE VEGETABLE GARDEN!\"",
            "Mr. Blueberry, the caretaker, leaned on his mop. \"I was at a crossroads, where three paths or more meet.\"",
            "Ms. Peapod, the librarian, put a finger to her lips. \"Shhh. I was not at the Water Fountain.\""] },
          { text: [
            "\"I've cracked it!\" said Mo. \"It was Kevin Dimbleby! He's the class clown!\"",
            "\"Kevin was eating crackers right next to us,\" said Zara.",
            "\"Suspicious crackers,\" said Mo.",
            "Zara looked around the playground and found two clues. The padlock on the Bell Cupboard still had a cobweb on it, so nobody had been in there. And there were big grown-up boot prints in the Mud Patch.",
            "She turned the map to you. \"Where was everyone at 10:15? And who was right next to the Bike Shed?\""] },
        ],
      },
      {
        id: "duck2", title: "Chapter 2: The Flag Fiasco", puzzle: "duck2",
        pages: [
          { text: [
            "Mr. Blueberry had been at the Climbing Frame, right next to the Bike Shed. \"Nobody was behind that shed,\" he said. \"The rope went tight all by itself, just as the principal walked past.\"",
            "Zara wrote it down. Mo decided the Bandit was a ghost.",
            "Sergeant Nibbles was promoted to Captain Nibbles for not getting wet."] },
          { text: [
            "On Wednesday, everyone was careful. Kevin checked his chair for ducks. Coach Cherry checked his whistle for ducks. Mo checked his sandwich for ducks.",
            "At 9:00 exactly, the fire alarm went off. BRRRRING!",
            "Everyone hurried out and lined up by the Flagpole. Everyone looked up. The school flag was gone. In its place flapped a giant yellow duck that said QUACK! DAY 3!",
            "Principal Plumpton dropped his coffee. \"PICKLES!\" he bellowed. \"QUINN!\"",
            "\"We know, sir,\" said Zara. \"Find that Bandit.\""] },
          { text: [
            "Four grown-ups had still been inside when the alarm rang. After the fire drill, Zara asked each of them where they had been.",
            "Coach Cherry blew his whistle. TWEEEET! \"MR. BLUEBERRY WAS RIGHT NEXT TO ME!\"",
            "\"I was at a crossroads,\" said Mr. Blueberry. \"And it wasn't me. It was probably the pipes.\"",
            "\"Shhh,\" said Ms. Peapod. \"I was right next to the Front Door.\"",
            "Mrs. Lavender hummed and stirred her soup. \"Ms. Peapod and I were two paths apart, dear.\""] },
          { text: [
            "Mo gasped. \"She's HUMMING! The Bandit is MRS. LAVENDER!\"",
            "\"Mrs. Lavender always hums,\" said Zara. \"So do you.\"",
            "\"...Hmm,\" said Mo.",
            "Zara found three clues. The Hall floor had just been mopped, and there were no footprints on it. The grass round the Flagpole was wet with dew, with no footprints either. And in the Toilets, the toilet roll was still spinning.",
            "\"Who was right next to the Flagpole?\" she asked you. \"They might have seen who swapped the flag.\""] },
        ],
      },
      {
        id: "duck3", title: "Chapter 3: The Wobbly Trophies", puzzle: "duck3",
        pages: [
          { text: [
            "Mrs. Lavender had been in the Kitchen, right next to the Flagpole. \"I didn't see a soul out there, dears,\" she said. \"But when I opened the window, that flag rope smelled of coffee.\"",
            "Zara wrote it down. Mo decided the Bandit was a coffee bean.",
            "Captain Nibbles was promoted to Major Nibbles for finding a cracker."] },
          { text: [
            "On Thursday, the grown-ups came in early to get ready for Mrs. Lavender's party. But first, Principal Plumpton had something important to do: polish his trophies.",
            "He loves his trophy cabinet. It is full of shiny cups that say BEST PRINCIPAL 1998, BEST PRINCIPAL 1999 and BEST PRINCIPAL 2000. He gave them all to himself.",
            "At 8:30, he unlocked the cabinet with the only key and opened the glass door.",
            "The trophies went... WOBBLE."] },
          { text: [
            "Every single trophy was full of green jelly.",
            "SPLORP! The biggest cup slid off the shelf and landed upside down on the principal's head. Green jelly dribbled down his hairpiece. On top sat a rubber duck with a note: QUACK! DAY 4!",
            "Stuck in the jelly was a very old school photo of two kids holding two rubber ducks. One of them had a VERY big curl of hair.",
            "The principal snatched the photo and stuffed it in his pocket. \"Nothing to see here!\" he wobbled. \"PICKLES! QUINN!\""] },
          { text: [
            "Four grown-ups had been in school since early that morning. Zara asked each of them where they were at 8:30.",
            "Coach Cherry blew his whistle. TWEEEET! \"MS. PEAPOD WAS NOWHERE NEAR ME! SHE WAS THREE PATHS AWAY, AT LEAST!\"",
            "\"I was right next to the Gym,\" said Mr. Blueberry. \"The pipes were leaking again.\"",
            "\"Shhh,\" said Ms. Peapod. \"Mrs. Lavender was right next to me.\"",
            "Mrs. Lavender hummed. \"Mr. Blueberry and I were two paths apart, dear. And I was at a crossroads.\""] },
          { text: [
            "Mo spun round and pointed. \"JELLY! Who makes the jelly in this school? The LUNCH LADY!\"",
            "\"I make jelly every Thursday, dear,\" said Mrs. Lavender. \"Today it's strawberry.\"",
            "Zara wrote: Her jelly is red. The trophy jelly is green."] },
          { text: [
            "Then Zara found three clues. In front of the Trophy Cabinet, jelly had splatted all over the floor, with no footprints in it. In the Hall, a party banner lay drying, and the wet paint had no footprints either. And in the Gym, a basketball was still bouncing.",
            "\"Who was right next to the Trophy Cabinet?\" she asked you. \"They might have seen who filled those trophies.\""] },
        ],
      },
      {
        id: "duck4", title: "Chapter 4: The Last Quack", puzzle: "duck4",
        pages: [
          { text: [
            "Ms. Peapod had been in the Music Room, right next to the Trophy Cabinet. \"Shhh,\" she whispered. \"Nobody went near that cabinet all morning. The jelly was already in those trophies when I came in at 7:30. And jelly takes all night to set.\"",
            "Zara underlined it twice. \"So the Bandit filled the trophies last night. With the key.\"",
            "Mo decided the Bandit was a jelly ghost. Major Nibbles was promoted to Colonel Nibbles for sitting very still."] },
          { text: [
            "On Friday afternoon, Zara read her notebook one more time. Monday: the office was locked. Tuesday: nobody was holding the rope. Wednesday: the flag rope smelled of coffee. Thursday: the trophies were filled overnight, with the only key.",
            "\"Something about this is very familiar,\" she said.",
            "But there was no time to think. It was Mrs. Lavender's surprise party! The whole school hid in the dark Hall. High above them hung a big net full of balloons, ready to drop at the big moment.",
            "\"SHHH,\" said Ms. Peapod, to three hundred children and one hamster."] },
          { text: [
            "At 3:00, the Hall Doors creaked open. The lights flicked on.",
            "\"SURPRISE!\"",
            "The net opened. But it wasn't full of balloons.",
            "Three thousand rubber ducks rained down on everybody. Everybody except Mrs. Lavender, who stood in the doorway with her mouth wide open. The last duck to land had a note: QUACK! DAY 5! THE END!"] },
          { text: [
            "Zara climbed out of the ducks. Somebody had pulled the rope that opened the net. Five grown-ups had been close by, and she asked each of them where they were.",
            "Coach Cherry blew his whistle. TWEEEET! \"I WAS RIGHT NEXT TO THE TROPHY CABINET!\"",
            "\"I was right next to the Light Switch, dear,\" said Mrs. Lavender.",
            "Mr. Blueberry picked a duck out of his ear. \"Coach Cherry and I were two paths apart. And I was at a crossroads.\""] },
          { text: [
            "\"Shhh,\" said Ms. Peapod. \"Mr. Blueberry and I were two paths apart. And I was closer to the Music Room than Principal Plumpton was.\"",
            "Principal Plumpton straightened his hairpiece. \"I was right next to the Stage.\"",
            "\"It's KEVIN!\" said Mo.",
            "\"Kevin was under the Cake Table with us,\" said Zara.",
            "\"Delicious crackers,\" said Kevin."] },
          { text: [
            "Zara found three clues. By the Duck Net Rope, someone had stepped in party glitter and left shiny grown-up shoe prints. In front of the Trophy Cabinet, the floor was still sticky with jelly, with no footprints. And the Kitchen door was taped shut with a sign: NO PEEKING, MRS. LAVENDER! Nobody had been inside.",
            "She turned the map to you. \"This time, the Bandit was right there. Who was holding the Duck Net Rope?\""] },
        ],
      },
      {
        id: "ending", title: "The Bandit Unmasked",
        pages: [
          { text: [
            "Coach Cherry had been at the Light Switch. Mr. Blueberry was under the Balloon Arch. Ms. Peapod was at the Piano. Mrs. Lavender had just come in through the Hall Doors.",
            "That left one grown-up, right next to the Stage, holding the Duck Net Rope.",
            "Everybody turned to look at Principal Plumpton. His shoes sparkled with glitter."] },
          { text: [
            "\"But you said you were next to the Stage!\" said Mo.",
            "\"I was,\" said the principal. \"The rope is right next to the Stage.\""] },
          { text: [
            "Zara opened her notebook. \"On Monday, your office was locked, and you have the key. On Tuesday, the rope went tight as you walked past, because you tugged it. On Wednesday, you swapped the flags the night before, with your coffee in your hand, and set off the fire alarm so we would all look up. And on Thursday, only you had the key to the trophy cabinet.\"",
            "The principal went very pink. \"And who would ever suspect a man covered in jelly?\""] },
          { text: [
            "He pulled the old photo out of his pocket. Two kids, two rubber ducks. A boy with a VERY big curl, and a girl holding a ladle.",
            "\"That's me,\" he said, patting his hairpiece. \"I had real hair back then. And that's my best friend. A long, long time ago, we were the very first Rubber Duck Bandits.\"",
            "Everyone looked at the girl with the ladle. Then everyone looked at Mrs. Lavender.",
            "Mrs. Lavender giggled. \"I knew it was you all along, Percy. Nobody else drinks that much coffee.\""] },
          { text: [
            "\"Fifty years of fish sticks deserved one last week of ducks,\" said the principal. He and Mrs. Lavender took a bow. The whole school cheered, and three thousand rubber ducks squeaked.",
            "That night, Zara wrote in her notebook: Pickles & Quinn Investigations. Cases solved: one.",
            "Mo added underneath: With help from our map-reader.",
            "And Colonel Nibbles was promoted to General Nibbles, for being there the whole time.",
            "THE END",
            "...QUACK."] },
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
