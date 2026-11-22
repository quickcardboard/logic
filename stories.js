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
            "They are detectives. They have a magnifying glass, a notebook, and a hamster called Sergeant Nibbles. They have solved zero cases.",
            "\"Today is going to be different,\" said Zara, chewing her PB and J."] },
          { text: [
            "\"Because I'm going to win the race?\" Mo replied, fidgeting with his rubber duck, Speedy McQuack.",
            "Today is the most exciting day of the school year. It's the Great Duck Race."] },
          { text: [
            "Every kid in school races a rubber duck down Wobbleton Stream. The winner gets to hold up the Golden Duck, a trophy made of real gold, as the legend says."] },
          { text: [
            "This year is the fiftieth race. So this year, the winner gets to keep the Golden Duck forever.",
            "\"Today, that Golden Duck is MINE!\" said Mo confidently."] },
          { text: [
            "At 2:30, the whole school squeezed into the Hall to begin the festivities. Principal Plumpton had just got back from a meeting in town."] },
          { text: [
            "He had just fetched the trophy cabinet key from its hook in the Office. He unlocked the Trophy Cabinet in front of the crowd and reached in for the Golden Duck.",
            "He lifted out the Golden Duck. Everybody cheered."] },
          { text: [
            "SQUEAK.",
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
            "\"Shhh,\" said Ms. Peapod the librarian. \"I was right next to the Toilets.\""] },
          { text: [
            "Mrs. Lavender the lunch lady hummed. \"I was right next to the Hall, dear.\"",
            "Mo narrowed his eyes. \"Coach Cherry wants his class to win that duck SO badly. It was HIM!\""] },
          { text: [
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
            "\"Could you open the cabinet?\" asked Zara."] },
          { text: [
            "\"Not me. There's only one key, and it hangs on a hook in the Office.\"",
            "Zara wrote: <i>Real at 8:30. Only one key, in the Office.</i>"] },
          { text: [
            "Sergeant Nibbles was promoted to Captain Nibbles for not eating the notebook.",
            "On the way to the Office, they cut through the library."] },
          { text: [
            "On the wall hung a very old photo of a tiny girl with big glasses, holding up the Golden Duck and grinning from ear to ear. The name under the photo had been torn off.",
            "\"Who's that?\" asked Mo loudly."] },
          { text: [
            "Ms. Peapod looked up from her desk. \"Shhh,\" she said.",
            "The key hook was right by the Office window."] },
          { text: [
            "\"The thief needed that key,\" said Zara. \"The Office is empty at recess. Let's find out where everyone was at 10:15.\"",
            "\"I WAS RIGHT NEXT TO THE WATER FOUNTAIN!\" said Coach Cherry."] },
          { text: [
            "\"I was at a place with three or more paths,\" said Mr. Blueberry.",
            "\"Shhh,\" said Ms. Peapod. \"Mr. Blueberry was right next to me.\"",
            "\"I was right next to the Bike Shed, dear,\" said Mrs. Lavender."] },
          { text: [
            "Zara found three clues. Mrs. Dot locks the Office at recess while she has her cup of tea, so nobody was in the Office."] },
          { text: [
            "Year 2 had spent the whole of recess drawing a giant chalk rainbow on the Front Steps. \"No grown-ups came near us,\" said a girl with chalky hands."] },
          { text: [
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
            "\"Edible gold, dear,\" said Mrs. Lavender. \"For the race cake.\"",
            "Captain Nibbles was promoted to Major Nibbles for licking it."] },
          { text: [
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
            "Mrs. Dot locks the Hall at lunch, so nobody was in the Hall."] },
          { text: [
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
            "\"I SAW IT THROUGH THE DOOR! THE GOLD PAINT POT WAS OPEN!\" he said. \"AND WHEN I WALKED PAST THE TROPHY CABINET AT 12:00, THE GOLDEN DUCK LOOKED... WET!\""] },
          { text: [
            "\"So it was swapped after 10:30, but before 12:00,\" said Zara.",
            "Major Nibbles was promoted to Colonel Nibbles for sitting very still."] },
          { text: [
            "Zara ran to the school timetable on the wall. \"In lesson time, the Hall always has a class in it,\" she said. \"Except at 11:00. At 11:00, the whole school was in the Gym, decorating ducks for the race.\""] },
          { text: [
            "\"So the Hall was empty,\" said Mo.",
            "\"Empty,\" said Zara. \"The perfect time to sneak past it to the Trophy Cabinet.\""] },
          { text: [
            "It was 3:20. Ten minutes left. Zara asked the grown-ups one last time: where were you at 11:00?",
            "Coach Cherry blew his whistle. TWEEEET! \"I WAS AT A PLACE WITH THREE OR MORE PATHS!\""] },
          { text: [
            "Mr. Blueberry wrung out his mop. \"I wasn't in the Library. I was right next to the Gym.\"",
            "\"Coach Cherry was right next to me, dear,\" said Mrs. Lavender."] },
          { text: [
            "Ms. Peapod straightened her glasses. \"Shhh,\" she whispered. \"I was right next to the Stage.\"",
            "\"It's KEVIN!\" said Mo."] },
          { text: [
            "\"Kevin was in the Gym with us,\" said Zara. \"Gluing googly eyes on his duck.\"",
            "\"Seventeen googly eyes,\" said Kevin proudly."] },
          { text: [
            "Zara found three clues. In front of the Trophy Cabinet was a drop of gold paint, with half a grown-up shoe print in it.",
            "Mrs. Dot locks the Hall whenever no class is booked, so nobody was in the Hall."] },
          { text: [
            "And every kid in the Gym remembered a grown-up dressed as a duck, handing out googly eyes.",
            "Zara thought. \"Who was at the Trophy Cabinet at 11:00?\""] },
          { text: [
            ] },
        ],
      },
      {
        id: "ending", title: "The Bandit Unmasked",
        pages: [
          { text: [
            "Coach Cherry had been in the Gym. Mr. Blueberry was in the Art Room."] },
          { text: [
            "Mrs. Lavender was in the Library, returning a cookbook.",
            "That left one grown-up at the Trophy Cabinet."] },
          { text: [
            "Everybody turned to look at Ms. Peapod. On the bottom of her shoe was a smudge of gold paint.",
            "\"But you said you were right next to the Stage!\" said Mo."] },
          { text: [
            "\"I was,\" said Ms. Peapod quietly. \"The Trophy Cabinet is right next to the Stage.\"",
            "Ms. Peapod smiled guiltily."] },
          { text: [
            "\"At 11:00, everyone was in the Gym, even Mrs. Dot, who was judging the ducks,\" said Zara. \"So you took the key from the empty Office, swapped the ducks, and put the key back.\""] },
          { text: [
            "Zara thought about the old photo in the library. The tiny girl with the big glasses.",
            "\"That's you,\" she said. \"You won the very first Great Duck Race.\""] },
          { text: [
            "Ms. Peapod nodded. \"I was the shyest girl in the whole school. Nobody ever noticed me. Then my little duck won, and everybody cheered my name.\""] },
          { text: [
            "She sniffed. \"If someone takes the Golden Duck home today, it will be gone from our school forever.\""] },
          { text: [
            "She walked to the library, reached behind the big dictionary, and took out the real Golden Duck. It shone like the sun.",
            "Principal Plumpton looked at it for a long time."] },
          { text: [
            "\"Ms. Peapod is right,\" he said at last. \"The Golden Duck belongs to everyone. From now on, it stays here, and every winner gets their name below it on a plaque.\""] },
          { text: [
            "\"And Ms. Peapod,\" he added, \"will hand it out.\"",
            "For the first time anyone could remember, Ms. Peapod didn't say \"Shhh.\" She cheered."] },
          { text: [
            "At 3:30 on the dot, three hundred rubber ducks raced down Wobbleton Stream."] },
          { text: [
            "Speedy McQuack came last. Kevin's duck, who started the race with seventeen googly eyes, came first, finishing with one eye."] },
          { text: [
            "That night, Zara wrote in her notebook: <i>Mo and Zara Consulting Services. Cases solved: one.</i>",
            "And Colonel Nibbles was promoted to General Nibbles, for being there the whole time."] },
          { text: [
            "THE END"] },
        ],
      },
    ],
  },
  {
    id: "egg",
    title: "The Runaway Dragon Egg",
    spine: "#d9480f",
    ink: "#ffffff",
    theme: { accent: "#d9480f", accentInk: "#ffffff", soft: "#ffe8d9" },
    cover: "egg",
    ages: "Ages 7 to 10",
    teaser: "On Hatching Day, a dragon egg vanishes from Crumbleton Castle. Nobody stole it: it just keeps getting moved by accident. Two kid detectives and a teacup-sized dragon have until sunset to follow it.",
    pdf: "pdf/the-runaway-dragon-egg.pdf",
    chapters: [
      {
        id: "prologue", title: "Hatching Day, 3:00: The Empty Cushion",
        pages: [
          { text: [
            "Princess Wren did not want to be a princess. She wanted to be a detective."] },
          { text: [
            "Every day after lunch, she and her best friend, Squire Pip, sat behind a cardboard box in the Great Hall."] },
          { text: [
            "So far they had solved one case: The Missing Sock. It was on Pip's head."] },
          { text: [
            "They also had Toast, a dragon the size of a teacup. He sneezed sparks when he was excited, so Squire Toast was not allowed near the curtains."] },
          { text: [
            "Today was Hatching Day. At 8:00 that morning, Grandma Ember had landed in the Courtyard. She was a dragon the size of a bus, carrying an egg as big as a pumpkin, speckled orange and green."] },
          { text: [
            "\"My grandbaby,\" she said proudly. \"It hatches at sunset. I'm flying to fetch its mum and dad. Will you keep it warm for the day?\""] },
          { text: [
            "\"Of course!\" said the Queen."] },
          { text: [
            "\"Careful, it's a wobbly one,\" said Grandma Ember. \"Dragon eggs are as tough as rocks. You could drop one off a tower.\""] },
          { text: [
            "She thought for a moment. \"Please don't.\" Then she flapped away, WHOOMPH, and blew everybody's hats off."] },
          { text: [
            "The Queen put the egg on a velvet cushion by the fire in the Throne Room, and tucked a big pile of warm towels around it."] },
          { text: [
            "\"Nobody touch the egg,\" she said, and shut the door. Then she rode into town to buy three hundred party hats."] },
          { text: [
            "All day, the castle got ready for the party. Mother Mulberry the cook baked a Hatching Cake. Lady Bluebell, the royal trumpeter, practiced the sunset fanfare."] },
          { text: [
            "Sir Radish built a big Bonfire Pile in the Courtyard, for the dragons to light. And Wizard Fernbeard looked for his crystal ball. He loses it every Tuesday."] },
          { text: [
            "At 3:00, the Queen sent Wren and Pip to fetch the egg. The velvet cushion was empty. The egg was gone. So were the towels."] },
          { text: [
            "\"GOBLINS!\" yelled Pip. \"Sneaky egg-stealing goblins!\""] },
          { text: [
            "\"There's no such thing as goblins, Pip,\" said Wren."] },
          { text: [
            "The Queen went very pale. \"Grandma Ember lands at sunset. That's 6:00. What will we tell her?\""] },
          { text: [
            "\"We're detectives, Your Majesty,\" said Wren. \"Give us until sunset. We'll follow that egg.\""] },
        ],
      },
      {
        id: "egg1", title: "Chapter 1: 10:00, The Walking Towels", puzzle: "egg1",
        pages: [
          { text: [
            "\"First question,\" said Wren. \"The towels are gone too. Who took them?\""] },
          { text: [
            "Ollie the page boy put up his hand. \"At 10:00, I saw a pile of towels walk out of the Throne Room. It had LEGS!\""] },
          { text: [
            "\"A TOWEL MONSTER!\" said Pip."] },
          { text: [
            "\"Or a grown-up carrying a lot of towels,\" said Wren. She asked the grown-ups where they had been at 10:00."] },
          { text: [
            "Sir Radish twirled his moustache. \"By my mighty moustache! I cannot remember. I did five hundred push-ups this morning, and it is all a blur.\""] },
          { text: [
            "Lady Bluebell blew her trumpet. TOOT! \"I was right next to the Armoury.\""] },
          { text: [
            "\"Hmmm,\" mumbled Wizard Fernbeard. \"I was right next to the Armoury too. Hmmm. But I wasn't on the Grand Stairs.\""] },
          { text: [
            "\"Have you seen my crystal ball?\" he added."] },
          { text: [
            "Mother Mulberry wiped her floury hands. \"I was at a place with three or more paths, my little dumplings. But not the Great Hall.\""] },
          { text: [
            "Wren found two clues. Ollie had seen the walking towels leave the Throne Room, so someone was in there at 10:00."] },
          { text: [
            "And the kids' choir had practiced in the Chapel at 10:00 with the door shut.",
            "\"No grown-ups came in,\" sang the choir. So nobody was in the Chapel."] },
          { text: [
            "\"Who was in the Throne Room at 10:00?\" Wren asked herself."] },
        ],
      },
      {
        id: "egg2", title: "Chapter 2: 10:30, The Speckled Pumpkin", puzzle: "egg2",
        pages: [
          { text: [
            "Sir Radish had been in the Throne Room."] },
          { text: [
            "\"By my mighty moustache! Of course!\" he boomed. \"It's my turn to do the laundry. I fetch the towels every morning at 10:00.\""] },
          { text: [
            "\"But the Queen said nobody touch the egg!\" said Pip."] },
          { text: [
            "\"I did not touch the egg,\" said Sir Radish. \"I only touched the towels.\""] },
          { text: [
            "\"They were VERY heavy today,\" he added. \"I thought it was excellent training.\""] },
          { text: [
            "He had carried the towels to the Laundry and tipped them into the big washtub.",
            "\"Something went BONK and rolled out the door toward the Kitchen. But I was late for sword practice, so I did not look.\""] },
          { text: [
            "\"The egg was in the towels!\" said Wren. \"And then it rolled into the Kitchen.\""] },
          { text: [
            "Squire Toast was promoted to Sir Toast, for not setting fire to a single towel."] },
          { text: [
            "Wren asked the grown-ups where they had been at 10:30."] },
          { text: [
            "\"By my mighty moustache! I was at a dead end,\" said Sir Radish. \"But not the Throne Room. I had left by then.\""] },
          { text: [
            "TOOT! \"I was right next to the Throne Room,\" said Lady Bluebell."] },
          { text: [
            "\"Hmmm,\" said Wizard Fernbeard. \"I was at a dead end, right next to the Pumpkin Patch. My crystal ball was not there. Hmmm.\""] },
          { text: [
            "\"I was right next to the Pantry, my little dumplings,\" said Mother Mulberry."] },
          { text: [
            "\"A FOX!\" said Pip. \"Foxes LOVE eggs!\""] },
          { text: [
            "\"Pip, it's as big as a pumpkin,\" said Wren. \"A fox would need a wheelbarrow.\""] },
          { text: [
            "Wren found one clue. The Pantry is locked until lunch, so nobody can nibble the Hatching Cake. Nobody was in the Pantry."] },
          { text: [
            "\"Who was in the Kitchen at 10:30?\" Wren asked herself. \"They must have seen the egg roll in.\""] },
        ],
      },
      {
        id: "egg3", title: "Chapter 3: 12:00, The Crystal Ball", puzzle: "egg3",
        pages: [
          { text: [
            "Mother Mulberry had been in the Kitchen."] },
          { text: [
            "\"Oh, my little dumplings!\" she said. \"At 10:30, a giant speckled pumpkin rolled across my Kitchen floor.\""] },
          { text: [
            "\"And I said, pumpkins don't belong in my Kitchen. Pumpkins belong in the Pumpkin Patch! So I carried it outside.\""] },
          { text: [
            "\"That wasn't a pumpkin,\" said Wren.",
            "\"Oh, my giddy gravy,\" said Mother Mulberry."] },
          { text: [
            "They ran to the Pumpkin Patch. There were pumpkins everywhere. Big ones, small ones, lumpy ones. But not one of them was speckled."] },
          { text: [
            "\"The pumpkins ATE it!\" said Pip."] },
          { text: [
            "\"Psst,\" said a voice from an apple tree. It was Bean, Pip's little sister. She climbs everything."] },
          { text: [
            "\"At 12:00, I saw a grown-up pick up the biggest pumpkin,\" said Bean. \"But my hat fell over my eyes, so I didn't see who.\""] },
          { text: [
            "Sir Toast was promoted to Lord Toast, for eating only ONE apple."] },
          { text: [
            "Wren asked the grown-ups where they had been at 12:00."] },
          { text: [
            "\"By my mighty moustache! I was right next to the Stables,\" said Sir Radish. \"And Wizard Fernbeard and I were exactly two paths apart.\""] },
          { text: [
            "TOOT! \"I was right next to the Laundry,\" said Lady Bluebell."] },
          { text: [
            "\"I was right next to the Laundry too, my little dumplings,\" said Mother Mulberry. \"But I wasn't at the Well.\""] },
          { text: [
            "\"Hmmm,\" said Wizard Fernbeard. \"Where was I? I have been looking for my crystal ball all day. Hmmm.\""] },
          { text: [
            "\"Who picked up the speckled pumpkin at 12:00?\" Wren asked herself."] },
        ],
      },
      {
        id: "egg4", title: "Chapter 4: 2:30, Bonk, Bonk, Bonk", puzzle: "egg4",
        pages: [
          { text: [
            "Wizard Fernbeard had been in the Pumpkin Patch."] },
          { text: [
            "\"Hmmm! Yes!\" he said. \"I found my crystal ball in the Pumpkin Patch. Round and warm, just like always.\""] },
          { text: [
            "\"Is your crystal ball speckled?\" asked Pip.",
            "\"Hmmm,\" said the wizard. \"Not usually.\""] },
          { text: [
            "He had carried it up to his tower and put it on his table, next to his bubbling cauldron. Then he stared into it."] },
          { text: [
            "\"I saw a terrible omen,\" he whispered. \"Something small... and scaly... and HUNGRY.\""] },
          { text: [
            "\"Then I fell asleep. A BONK, BONK, BONK woke me up. My cuckoo clock said 2:30. Then I went right back to sleep.\""] },
          { text: [
            "They ran up the Wizard's Tower. The table was empty."] },
          { text: [
            "But there was a little dent in every single stair, all the way down. BONK, BONK, BONK."] },
          { text: [
            "\"The egg wobbled off the table,\" said Wren, \"rolled down the stairs, and went out the tower door.\""] },
          { text: [
            "Lord Toast was promoted to Duke Toast, for counting all ninety-nine dents."] },
          { text: [
            "It was 4:30. Sunset was at 6:00. Wren asked the grown-ups one last time: where were you at 2:30? Did you notice anything?"] },
          { text: [
            "\"Hmmm,\" said Wizard Fernbeard. \"I was at the Wizard's Tower. Snoring.\""] },
          { text: [
            "\"By my mighty moustache!\" said Sir Radish. \"I heard a big THUD right next to me. But I was busy, so I did not look.\""] },
          { text: [
            "\"And Lady Bluebell was far from me,\" he added. \"Three paths or more!\""] },
          { text: [
            "TOOT! \"I was right next to the Courtyard,\" said Lady Bluebell. \"My eyes were shut. I was practicing my fanfare.\""] },
          { text: [
            "\"I was right next to the Apple Orchard, my little dumplings,\" said Mother Mulberry. \"I was picking REAL pumpkins for a pie.\""] },
          { text: [
            "\"It rolled into the moat,\" said Pip, \"and now a duck is sitting on it!\""] },
          { text: [
            "Wren found one clue. Bean had been brushing the ponies in the Stables at 2:30.",
            "\"Nobody came in,\" said Bean. \"Not a grown-up, and not an egg.\""] },
          { text: [
            "\"This time,\" said Wren, \"we put the egg on the map too. Where did the egg stop?\""] },
        ],
      },
      {
        id: "ending", title: "The Warmest Spot",
        pages: [
          { text: [
            "Wizard Fernbeard had been snoring in his tower. Lady Bluebell had been on the Drawbridge, and Mother Mulberry in the Pumpkin Patch."] },
          { text: [
            "Sir Radish had been at the Forge, getting the dent knocked out of his helmet after sword practice."] },
          { text: [
            "\"So the THUD was right next to the Forge,\" said Wren. \"At the Bonfire Pile!\""] },
          { text: [
            "Everybody ran to the Bonfire Pile and dug into the straw. Sir Radish dug with his helmet. Mother Mulberry dug with a soup ladle."] },
          { text: [
            "And there, snug and warm next to the Forge, was the speckled egg."] },
          { text: [
            "\"It rolled out of the tower and all the way to the warmest spot in the castle,\" said Wren. \"All by itself.\""] },
          { text: [
            "It was 5:59. WHOOMPH! Grandma Ember landed in the Courtyard, with two more dragons behind her. They blew everybody's hats off."] },
          { text: [
            "\"Where's my grandbaby?\" she asked."] },
          { text: [
            "\"In the Bonfire Pile,\" said Wren. \"It was a wobbly one.\""] },
          { text: [
            "Grandma Ember laughed a big smoky laugh. \"A wobbly one always finds the warmest spot.\""] },
          { text: [
            "She took a deep breath and puffed. The Bonfire Pile went WHOOSH!",
            "TOOT-TA-TOOOOT! went Lady Bluebell's sunset fanfare."] },
          { text: [
            "CRACK.",
            "A tiny dragon poked its head out of the egg. It blinked. The very first face it saw was Toast's."] },
          { text: [
            "The baby dragon sneezed a spark. Toast sneezed a spark back."] },
          { text: [
            "\"Something small, scaly and HUNGRY,\" whispered Wizard Fernbeard. \"My omen!\"",
            "The baby burped."] },
          { text: [
            "Mother Mulberry wheeled out the Hatching Cake. Sir Radish carried the baby around the Courtyard on a velvet cushion, very, very carefully."] },
          { text: [
            "And Wizard Fernbeard found his crystal ball. It was in his hat."] },
          { text: [
            "That night, Wren wrote in her notebook: <i>Wren and Pip, Royal Detectives. Cases solved: two.</i>"] },
          { text: [
            "Everyone in the castle had helped move the egg, by accident. And everyone in the castle had helped find it, on purpose."] },
          { text: [
            "And Duke Toast got his best promotion yet. He was now a Big Brother."] },
          { text: [
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
