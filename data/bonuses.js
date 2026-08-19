// Bonus catalog for the hover tooltips in index.html.
// Keys must match the display names in civList / leaderDict exactly.
// [food] [production] [gold] [science] [culture] [happiness] [influence]
// tokens are swapped for yield icons by formatBonusText() in index.html.
// Sourced from the Civilization VII wiki (each civ's own-age text).

window.civBonuses = {
    "Aksum": {
        ability_name: "Kingdom of Natural Wealth",
        ability: "+3 [gold] Gold on Resources in Settlements adjacent to Coast. +1 Trade Route capacity with other civilizations, and all civilizations have +1 Trade Route capacity with you. Trade Routes to or from your Settlements have unlimited Range. +30% [production] Production towards the Great Stele Wonder.",
        attributes: "Cultural, Economic",
        units: [
            "Dhow — heavy naval unit that can create Trade Routes",
            "Tankwa — unplunderable trade ship with extra sight"
        ],
        infrastructure: [
            "Hawilt — improvement; [gold] Gold, plus [culture] Culture near Wonders"
        ],
        civic: "Periplus of the Erythraean Sea, Monumentum Adulitanum, Book of the Himyarites"
    },
    "Assyria": {
        ability_name: "Treasures of Nineveh",
        ability: "Gain a Technology and a Codex upon capturing a Settlement for the first time. Codices are not rewarded from Technologies. +30% [production] Production towards constructing Dur-Sharrukin.",
        attributes: "Militaristic, Scientific",
        units: [
            "Magarru — fast chariot that moves after attacking",
            "Turtanu — commander boosting attacks on fortified districts"
        ],
        infrastructure: [
            "Ekallu — quarter; [production] Production per Great Work here",
            "Citadel — fortified building granting [production] Production",
            "Royal Library — [science] Science building with Codex slots"
        ],
        civic: "Birtūtu, Tupšarrūtu, Kibrāt Arba'i"
    },
    "Egypt": {
        ability_name: "Gifts of Osiris",
        ability: "+2 [production] Production on Improvements and Districts on Navigable Rivers. Minor rivers do not end unit Movement. +30% [production] Production towards constructing the Pyramids.",
        attributes: "Cultural, Economic",
        units: [
            "Medjay — maintenance-free infantry, stronger in friendly territory",
            "Tjaty — unique Great Person"
        ],
        infrastructure: [
            "Necropolis — quarter granting [gold] Gold on Wonder completion",
            "Mastaba — [culture] Culture building; [gold] Gold near Wonders, Desert",
            "Mortuary Temple — [gold] Gold building; [happiness] Happiness near rivers"
        ],
        civic: "Arrival of Hapi, Scales of Anubis, Light of Amun-Ra"
    },
    "Greece": {
        ability_name: "Demokratia",
        ability: "+3 [influence] Influence on the Palace. +2 [culture] Culture for active Endeavors, Sanctions, and Diplomatic Projects you started or supported. +3 Tourism for every City-State you are Suzerain of. +30% [production] Production towards constructing the Oracle.",
        attributes: "Cultural, Diplomatic",
        units: [
            "Hoplite — infantry, stronger adjacent to other Hoplites",
            "Logios — unique Great Person"
        ],
        infrastructure: [
            "Acropolis — quarter; [gold] Gold per City-State Suzerainty",
            "Odeon — [happiness] Happiness building with [culture] Culture adjacency",
            "Parthenon — [culture] Culture building; [influence] Influence on rough terrain"
        ],
        civic: "Ekklesia, Agoge, Symmachia"
    },
    "Han China": {
        ability_name: "Nine Provinces",
        ability: "The Capital gains a Population when it completes [science] Science Buildings. The Capital and new Towns gain an additional Population with their first growth event. +30% [production] Production towards constructing Weiyang Palace.",
        attributes: "Diplomatic, Scientific",
        units: [
            "Chu-Ko-Nu — repeating crossbowman with zone of control",
            "Shì Dàfū — unique Great Person"
        ],
        infrastructure: [
            "Great Wall — chained improvement; [culture] Culture and strong defense"
        ],
        civic: "Ren, Zhi, Li, Yi"
    },
    "Heian Japan": {
        ability_name: "Pure Land",
        ability: "+2 [culture] Culture on Improvements on Breathtaking tiles. +30% [production] Production towards the Hoo-do Hall Wonder.",
        attributes: "Cultural, Diplomatic",
        units: [
            "Yumi — mobile ranged archer, stronger when stationary",
            "Shijin — random Great Person requiring a Jinja"
        ],
        infrastructure: [
            "Jinja — land or sea shrine; [happiness] Happiness, appeal-based [culture] Culture"
        ],
        civic: "Ritsuryo, Urban Grid, Waka, Mono No Aware"
    },
    "Khmer": {
        ability_name: "Ksekam Chamnon",
        ability: "Districts on Rivers do not remove the natural yield of the tile. +50% Growth Rate in the Capital, but -5 [happiness] Happiness for every other City. +30% [production] Production towards constructing Angkor Wat.",
        attributes: "Expansionist, Scientific",
        units: [
            "Yuthahathi — war elephant immune to flood damage",
            "Vaishya — settler ignoring wet terrain penalties"
        ],
        infrastructure: [
            "Baray — reservoir; [food] Food and flood protection"
        ],
        civic: "Mousong, Amnach, Chakravarti"
    },
    "Maurya India": {
        ability_name: "Dhamma Thambhā",
        ability: "+2 [happiness] Happiness on [happiness] Happiness, Military and [science] Science Buildings. Land Units are fully Healed when you enter a Celebration. Can unlock 2 Pantheons. +30% [production] Production towards constructing Sanchi Stupa.",
        attributes: "Militaristic, Scientific",
        units: [
            "Purabhettarah — siege elephant strong against fortified districts",
            "Nagarika — settler granting [happiness] Happiness to new settlements"
        ],
        infrastructure: [
            "Matha — quarter; +10% [happiness] Happiness in settlement",
            "Dharamshala — [happiness] Happiness building with [science] Science adjacency",
            "Vihara — [happiness] Happiness building with [culture] Culture adjacency"
        ],
        civic: "Acharya, Vyuham, Mantriparishad"
    },
    "Maya": {
        ability_name: "Skies of Itzamna",
        ability: "After researching a Technology, gain [culture] Culture equal to 10% of its cost. After studying a Civic, gain [science] Science equal to 10% of its cost. +30% [production] Production towards constructing Mundo Perdido.",
        attributes: "Cultural, Scientific",
        units: [
            "Hul'che — javelin thrower ignoring vegetation penalties",
            "Jaguar Slayer — jungle infantry that places traps"
        ],
        infrastructure: [
            "Uwaybil K'uh — quarter; [production] Production from researched techs",
            "Jalaw — [happiness] Happiness building with [culture] Culture adjacency",
            "K'uh Nah — [science] Science building, stronger on vegetation"
        ],
        civic: "Rain of Chaac, Lords of Xibalba, Calendar Round"
    },
    "Mississippians": {
        ability_name: "Goose Societies",
        ability: "All Buildings receive +1 [food] Food adjacency for Resources. +10% [production] Production towards constructing Buildings. +30% [production] Production towards constructing Monks Mound.",
        attributes: "Economic, Expansionist",
        units: [
            "Burning Arrow — ranged unit that sets tiles burning",
            "Watonathi — merchant granting [gold] Gold per resource acquired"
        ],
        infrastructure: [
            "Potkop — improvement; [gold] Gold, [food] Food per adjacent resource"
        ],
        civic: "Earthworks, Cah-nah-ha, Waahih"
    },
    "Persia": {
        ability_name: "Hamarana Council",
        ability: "+3 Combat Strength for Infantry Units when attacking. Army Commanders start with a free Promotion. +30% [production] Production towards constructing Gate of All Nations.",
        attributes: "Economic, Militaristic",
        units: [
            "Immortal — infantry that heals after defeating enemies",
            "Hazarapatis — army commander with free Initiative promotion"
        ],
        infrastructure: [
            "Pairidaeza — garden improvement; [culture] Culture, [gold] Gold, unit healing"
        ],
        civic: "Spada, Satrapies, Baziš"
    },
    "Rome": {
        ability_name: "Twelve Tables",
        ability: "+1 [culture] Culture on Districts in the Capital and City Centers in Towns. Gain a free Infantry Unit in new Towns you found. +30% [production] Production towards constructing the Colosseum.",
        attributes: "Cultural, Militaristic",
        units: [
            "Legion — infantry strengthened by slotted Traditions",
            "Legatus — army commander that can found settlements"
        ],
        infrastructure: [
            "Forum — quarter; [culture] Culture per government Tradition",
            "Basilica — [influence] Influence building with [gold] Gold adjacency",
            "Temple of Jupiter — [happiness] Happiness building with [culture] Culture adjacency"
        ],
        civic: "Exercitus Romanus, Civis Romanus, Legatus Pro Praetore, Senatus Populusque Romanus"
    },
    "Carthage": {
        ability_name: "Phoenician Heritage",
        ability: "Can only have one City. Towns can purchase Water Buildings with any Town Focus, but cannot use Convert to City. Receive a second Merchant or Colonist, each time you purchase or train one. +30% [production] Production towards Byrsa.",
        attributes: "Militaristic, Economic",
        units: [
            "Numidian Cavalry — gold-purchased cavalry scaling with resources",
            "Colonist — settler; bonus population near resources"
        ],
        infrastructure: [
            "Punic Port — quarter increasing resource capacity",
            "Cothon — [production] Production building near coast and rivers",
            "Dockyard — [gold] Gold building with [food] Food adjacency"
        ],
        civic: "Shipsheds, Wisdom of Tanit, Sicilian Wars"
    },
    "Silla": {
        ability_name: "Maripgan",
        ability: "When you form an Alliance, both Leaders receive a free Trade Route from the other leader's Capital; these Trade Routes do not go away until the Alliance ends. +1 [influence] Influence for each Civilization you have at least 1 Trade Route with. +30% [production] Production towards constructing the Emile Bell.",
        attributes: "Diplomatic, Economic",
        units: [
            "Hwarang — fast mounted warrior counting as cavalry",
            "Sangdaedeung — merchant; [gold] Gold from positive relationships"
        ],
        infrastructure: [
            "Sachal — quarter; [gold] Gold per slotted resource",
            "Lecture Hall — [culture] Culture building; resource capacity on rough terrain",
            "Pagoda — [happiness] Happiness building with [influence] Influence adjacency"
        ],
        civic: "Kolp'um, Samguk Sagi, Seonggol, Jingol"
    },
    "Tonga": {
        ability_name: "Lords of the South",
        ability: "+1 [influence] Influence on the Palace and City Halls in Settlements adjacent to Coast. Receive a free Trade Route from a new City-State when you become their Suzerain. Cannot use the City-State Incorporate or the Levy Unit Action. +30% [production] Production towards constructing the Ha'amonga 'a Maui.",
        attributes: "Diplomatic, Economic",
        units: [
            "Kalia — war canoe strong against fortified districts",
            "Tehina — ocean-going settler that can coastal raid"
        ],
        infrastructure: [
            "Tofi'a — quarter; [culture] Culture per City-State Trade Route",
            "Langi — [culture] Culture building with [food] Food adjacency",
            "Vaikaukau — [happiness] Happiness building with coastal [culture] Culture adjacency"
        ],
        civic: "Lapita Origins, ʻEsi Maka Faakinanga, Kava Ceremony"
    },
    // ---------- Exploration Age ----------
    "Abbasid": {
        ability_name: "Medina",
        ability: "Receive 30 [gold] Gold for each Rural Population of the City when you create a Specialist. +20% [production] Production towards constructing Buildings in Cities with at least 5 Specialists. +30% [production] Production towards constructing the House of Wisdom.",
        attributes: "Expansionist, Scientific",
        units: [
            "Mamluk — skirmishing cavalry, stronger in settlements with 5+ Specialists",
            "'Alim — random unique Great Person, trainable in cities with an Ulema"
        ],
        infrastructure: [
            "Ulema — quarter; +1 [science] Science on Specialists in this city",
            "Madrasa — [science] Science building with quarter/Wonder adjacency",
            "Mosque — [happiness] Happiness building that unlocks founding a Religion"
        ],
        civic: "Round City, Mawla, Al-Jabr"
    },
    "Bulgaria": {
        ability_name: "Krum's Dynasty",
        ability: "Receive [production] Production in all Cities when pillaging Improvements equal to 50% of the HP or yields gained. -3 Combat Strength for all Military Units against Fortified Districts. +30% [production] Production towards constructing Rila Monastery.",
        attributes: "Expansionist, Militaristic",
        units: [
            "Bolyar — cavalry that ignores rough-terrain penalties and fights better there",
            "Tarkhan — fast commander whose units pillage for 1 Movement"
        ],
        infrastructure: [
            "Hidden Fortress — [production] Production and [culture] Culture per adjacent Mountain; stealthy fortification"
        ],
        civic: "Seven Tribes, Tarnovo Schools, Tsarstvie"
    },
    "Chola India": {
        ability_name: "Samayam",
        ability: "+3 [gold] Gold and +2 [influence] Influence for every active Trade Route. +1 Trade Route from the Improve Trade Relations action. +1 Movement for Merchants. +1 [gold] Gold per turn for imported Resources assigned to Cities. +30% [production] Production towards constructing the Brihadeeswarar Temple.",
        attributes: "Diplomatic, Economic",
        units: [
            "Kalam — heavy naval unit that can attack twice per turn",
            "Ottru — fleet commander; enemies in its radius lose Combat Strength"
        ],
        infrastructure: [
            "Five Hundred Lords — quarter; greatly extends land and naval trade range",
            "Manigramam — [happiness] Happiness building with [gold] Gold adjacency",
            "Anjuvannam — [gold] Gold building boosting naval unit [production] Production"
        ],
        civic: "Nagaram, Kanakam, Digvijaya, Monsoon Winds"
    },
    "Dai Viet": {
        ability_name: "Hich Tuong Si",
        ability: "When you create a Fortification Building or Wonder, gain 25 [culture] Culture for each Urban Population in the Settlement. +2 [culture] Culture and [food] Food on Fortification Constructables in Tropical terrain. +30% [production] Production towards constructing the Thành Huế.",
        attributes: "Cultural, Expansionist",
        units: [
            "Voi Chiến — war elephant that can move after attacking",
            "Quận Vương — settler granting [culture] Culture for nearby Tropical tiles"
        ],
        infrastructure: [
            "Water Puppet Theater — [food] Food and [happiness] Happiness on Floodplains; flood-proof settlement"
        ],
        civic: "Cấm Quân, Chữ Nôm, Thành Hoàng, Tứ Dân"
    },
    "Goryeo": {
        ability_name: "Byeongjo",
        ability: "+3 [culture] Culture from active Endeavors you have started or supported. +1 [culture] Culture on Unique Improvements in Towns and +1 [influence] Influence on Unique Improvements in Cities. +30% [production] Production towards constructing Buseoksa.",
        attributes: "Cultural, Diplomatic",
        units: [
            "Hwacha — siege unit with splash damage",
            "Tobang — cavalry, stronger on districts; [influence] Influence when garrisoning city centers"
        ],
        infrastructure: [
            "Gama — improvement on vegetated terrain; [culture] Culture plus [production] Production from adjacent Warehouse buildings"
        ],
        civic: "Cheonsu, Jikji, Tripitaka Koreana"
    },
    "Hawaii": {
        ability_name: "Moananuiākea",
        ability: "Can work Ocean tiles. +1 [happiness] Happiness and +2 [culture] Culture on all Marine tiles. +30% [production] Production towards constructing Hale o Keawe.",
        attributes: "Cultural, Expansionist",
        units: [
            "Leiomano — infantry, strong against cavalry and defending against heavy naval units",
            "Kahuna — support unit that heals all adjacent units"
        ],
        infrastructure: [
            "Lo'i Kalo — improvement; [food] Food and [production] Production, [culture] Culture from adjacent Fishing Boats"
        ],
        civic: "Mana, Ohana, He'e nalu"
    },
    "Iceland": {
        ability_name: "Kringla Heimsins",
        ability: "+1 Sight on Naval Units. Gain 500 [culture] Culture when you discover a Natural Wonder in Distant Lands. Gain a Relic every time you complete a Civic Mastery. -50% [production] Production towards training Missionaries, and their [gold] Gold cost is doubled. +30% [production] Production towards constructing Reykjaholt.",
        attributes: "Cultural, Militaristic",
        units: [
            "Víkingr — raider earning [science] Science from coastal pillaging",
            "Saga Hero — unique Great Person"
        ],
        infrastructure: [
            "Þingstaðr — improvement; [happiness] Happiness plus [culture] Culture from wet, volcanic, or vegetated neighbors"
        ],
        civic: "Landnámabók, Hugins Drekka, Væringjar, Þjóðveldið"
    },
    "Inca": {
        ability_name: "Apus",
        ability: "Can work Mountain tiles. +2 [food] Food and +1 [production] Production on Mountain tiles. Can generate Homelands Treasure Convoys worth 2 Cargo each in Cities with 3 worked Mountains after completing the Qhapaq Ñan Civic. +30% [production] Production towards constructing Machu Pikchu.",
        attributes: "Economic, Expansionist",
        units: [
            "Warak'aq — fast skirmisher, stronger attacking from rough terrain",
            "Chasqui — scout that sees past Mountains"
        ],
        infrastructure: [
            "Terrace Farm — improvement; [food] Food plus [gold] Gold to adjacent buildings"
        ],
        civic: "Mit'a, Ayllu, Qhapaq Ñan"
    },
    "Majapahit": {
        ability_name: "Negara",
        ability: "Culture Buildings gain an adjacency for Coastal tiles. +1 Specialist Limit in Districts on or adjacent to Coastal tiles. +30% [production] Production towards constructing Borobudur.",
        attributes: "Cultural, Expansionist",
        units: [
            "Cetbang — naval unit, strong against ships and pillaging at range",
            "Pedanda — missionary earning [culture] Culture and [gold] Gold on first conversions"
        ],
        infrastructure: [
            "Pura — quarter granting a Relic when completed",
            "Meru — [happiness] Happiness building, stronger near Natural Wonders and Mountains",
            "Candi Bentar — [culture] Culture building with coastal/river adjacency"
        ],
        civic: "Wayang, Aliran Kepercayaan, Nusantara"
    },
    "Ming China": {
        ability_name: "Great Canon of Yongle",
        ability: "+50% [science] Science in the Capital. -15 [science] Science per turn for each Social Policy, but not Tradition, in the Government. +1 Tradition slot. +30% [production] Production towards constructing the Forbidden City.",
        attributes: "Economic, Scientific",
        units: [
            "Xunleichong — ranged infantry, stronger on featureless tiles",
            "Maritime Envoy — merchant spawning Treasure Convoys from naval Trade Routes"
        ],
        infrastructure: [
            "Ming Great Wall — fortified improvement; [culture] Culture, [gold] Gold per adjacent fortification, and Tourism"
        ],
        civic: "Nine Garrisons, Lijia, Da Ming Lu"
    },
    "Mongolia": {
        ability_name: "Bokh",
        ability: "When you capture an opposing Settlement, gain the strongest Cavalry unit you can currently train. -50% [production] Production towards training Settlers. +30% [production] Production towards constructing Erdene Zuu.",
        attributes: "Expansionist, Militaristic",
        units: [
            "Keshig — cavalry that speeds up and heals after kills",
            "Noyan — commander granting cavalry a bigger flanking bonus"
        ],
        infrastructure: [
            "Örtöö — improvement; [gold] Gold, restores Movement to units entering the tile"
        ],
        civic: "Ulus, Four Hounds, Yassa"
    },
    "Normans": {
        ability_name: "Normannitas",
        ability: "+5 Combat Strength for Land Units and Fortified Districts adjacent to Coast. +25 HP on Fortified Districts. +30% [production] Production towards constructing the White Tower.",
        attributes: "Diplomatic, Militaristic",
        units: [
            "Chevaler — knight, stronger against slower units",
            "Sokeman — settler whose new towns start with a Wall"
        ],
        infrastructure: [
            "Donjon — quarter; free Chevaler on completion, faster cavalry [production] Production",
            "Bailey — [culture] Culture building that counts as a fortification",
            "Motte — [happiness] Happiness building, stronger on rough terrain"
        ],
        civic: "Consuetudines et Justicie, Common Law, Domesday Book"
    },
    "Republic of Pirates": {
        ability_name: "Flying Gang",
        ability: "Naval Units, Treasure Convoys, and the Buccaneer can move into other civilizations' borders without being at War or having Open Borders. Buccaneers gain 1 charge to create a new Settlement after receiving their first Promotion. Settlers cannot be trained or purchased, but you can capture other civilizations' Settlers. +5 [gold] Gold from your Naval Units defeating other Units. +30% [production] Production towards constructing Havana Harbor.",
        attributes: "Economic, Militaristic",
        units: [
            "Sloop — border-crossing raider earning [gold] Gold from kills",
            "Buccaneer — promotable founder unit with raiding-party charges"
        ],
        infrastructure: [
            "Haven — quarter; [gold] Gold per Treasure Resource, heals friendly ships",
            "Naval Arsenal — [gold] Gold building with resource adjacency",
            "Naval Station — [production] Production building with military/gold adjacency"
        ],
        civic: "Articles of Agreement, Ports of Call, Enemy of All Nations"
    },
    "Sengoku Japan": {
        ability_name: "Shogunate",
        ability: "+1 [influence] Influence, +3 [culture] Culture, and +3 [science] Science for every Army Commander XP earned in Combat. Culture Buildings no longer receive an Adjacency with Mountains. Science Buildings no longer receive an Adjacency with Resources. +30% [production] Production towards constructing Himeji Castle.",
        attributes: "Diplomatic, Militaristic",
        units: [
            "Samurai — infantry that self-upgrades after three kills",
            "Shinobi — stealth unit that can sabotage enemy Army Commanders"
        ],
        infrastructure: [
            "Tea House — improvement; [food] Food, [happiness] Happiness, and [culture] Culture per adjacent district"
        ],
        civic: "Tenka Bito, Ikki, Rakuichi-Rakuza, Kinsei"
    },
    "Shawnee": {
        ability_name: "Nepekifaki",
        ability: "+2 [food] Food on Improvements and Districts on Minor and Navigable River tiles in Settlements adjacent to Navigable Rivers. +1 Resource Capacity in the Capital per City-State you are Suzerain of. +30% [production] Production towards constructing Serpent Mound.",
        attributes: "Diplomatic, Economic",
        units: [
            "Kispoko Nena'to — infantry, stronger per unique Resource in your empire",
            "Hoceepkileni — fast scout for whom rivers don't end movement"
        ],
        infrastructure: [
            "Mawaskawe Skote — improvement; [food] Food plus [gold] Gold per adjacent Resource"
        ],
        civic: "Wiyehi Simekofi, Miyaska Latoweki, Telwatiki, Maleki Kintake"
    },
    "Songhai": {
        ability_name: "Tarikh al-Sudan",
        ability: "+2 Resource Capacity in Cities on Navigable Rivers. +1 [production] Production in Cities on Navigable Rivers for every Resource assigned to them. Can generate Homelands Treasure Convoys worth 2 Cargo each on Navigable Rivers after completing the Kanta Civic. +30% [production] Production towards constructing the Tomb of Askia.",
        attributes: "Economic, Militaristic",
        units: [
            "Gold Bangles Infantry — stronger on Resource tiles, better trade-route pillaging",
            "Tajiro — merchant earning [gold] Gold from river Trade Routes"
        ],
        infrastructure: [
            "Caravanserai — improvement; [gold] Gold with river/resource adjacency, extends trade range"
        ],
        civic: "Ships of the Desert, Hi-Koi, Kanta"
    },
    "Spain": {
        ability_name: "Siglo de Oro",
        ability: "+2 [food] Food, [gold] Gold, and [production] Production in Settlements adjacent to Coast and in Settlements following your Religion, or +4 if it is both, doubled in Distant Lands. +15% [gold] Gold efficiency towards converting a Town to a City, or +30% in Distant Lands. +30% [production] Production towards constructing El Escorial.",
        attributes: "Economic, Militaristic",
        units: [
            "Tercio — infantry granting nearby units anti-cavalry strength",
            "Conquistador — unique Great Person, trainable in settlements with a Plaza"
        ],
        infrastructure: [
            "Plaza — quarter; [gold] Gold per Distant Lands settlement",
            "Casa Consistorial — [culture] Culture building with quarter adjacency",
            "Casa de Contratación — [gold] Gold building with resource/river adjacency"
        ],
        civic: "Council of the Indies, Armada, New World Riches"
    },
    // ---------- Modern Age ----------
    "America": {
        ability_name: "Frontier Expansion",
        ability: "Gain 150 [gold] Gold every time you improve a Resource. +1 [production] Production on Resources. +30% [production] Production towards building the Statue of Liberty.",
        attributes: "Diplomatic, Economic",
        units: [
            "Marine — amphibious infantry with no embarkation penalties",
            "Prospector — civilian that claims a nearby land Resource"
        ],
        infrastructure: [
            "Industrial Park — quarter; GDP from Factory Resources in this settlement",
            "Railyard — [production] Production building with quarter/Wonder adjacency",
            "Steel Mill — [production] Production building; [gold] Gold per adjacent Resource"
        ],
        civic: "Yankee Ingenuity, Captains of Industry, Wartime Manufacturing"
    },
    "Buganda": {
        ability_name: "River Raids",
        ability: "Receive additional [culture] Culture when Pillaging Buildings or Improvements equal to the yield or healing gained. Land Units gain the Amphibious keyword. +6 [food] Food and +6 [culture] Culture on Lakes. +1 Tourism from Districts and Improvements on Lakes. +30% [production] Production towards constructing Muzibu Azaala Mpanga.",
        attributes: "Cultural, Expansionist",
        units: [
            "Abambowa — infantry that heals from pillaging",
            "Mwami — army commander doubling pillage yields in its radius"
        ],
        infrastructure: [
            "Kabaka's Lake — improvement; [happiness] Happiness, counts as a Lake for adjacency"
        ],
        civic: "'Nnalubaale, Blutabaalo, Nyanza"
    },
    "French Empire": {
        ability_name: "Liberté, Egalité, Fraternité",
        ability: "You can select the Celebration effects of any standard Government in the Modern Age. +30% [production] Production towards constructing the Eiffel Tower.",
        attributes: "Cultural, Diplomatic",
        units: [
            "Garde Impériale — infantry, stronger inside a friendly commander's radius",
            "Jacobin — unique Great Person"
        ],
        infrastructure: [
            "Avenue — quarter; [happiness] Happiness on this city's quarters",
            "Salon — [happiness] Happiness building with [culture] Culture adjacency",
            "Jardin à la Française — [culture] Culture building with [happiness] Happiness adjacency"
        ],
        civic: "Belle Époque, Voie Triomphale, Grande Armée, Code Civil des Français"
    },
    "Great Britain": {
        ability_name: "Workshop of the World",
        ability: "+25% [gold] Gold towards purchasing Buildings and +25% [production] Production towards constructing Buildings. +50% cost to convert Towns into Cities. +3 [science] Science on Active Buildings adjacent to Coast. +30% [production] Production towards the Battersea Power Station Wonder.",
        attributes: "Economic, Scientific",
        units: [
            "Revenge — fast naval unit dealing splash damage",
            "Antiquarian — explorer earning [culture] Culture from distant excavations"
        ],
        infrastructure: [
            "Financial Centre — quarter; [gold] Gold and [science] Science per connected settlement",
            "Royal Exchange — [gold] Gold building with quarter/Wonder adjacency",
            "Manufactory — [production] Production building; [gold] Gold along navigable rivers"
        ],
        civic: "Pax Britannica, Society of Antiquaries, Chartered Companies, Splendid Isolation"
    },
    "Joseon": {
        ability_name: "Munchi",
        ability: "+2 Specialist Limit in the Capital and other Cities with a Seowon. -1 Specialist Limit in all Cities other than the Capital without a Seowon. Has an initial City Limit of 2. Can purchase Tier 1 [science] Science and [culture] Culture Buildings in Towns. +30% [production] Production towards constructing Hwaseong.",
        attributes: "Cultural, Expansionist",
        units: [
            "Turtle Ship — heavy naval unit, stronger on Coast",
            "Jangyongyoung — army commander boosting units defending the Capital"
        ],
        infrastructure: [
            "Seowon — quarter; the settlement gains [culture] Culture from its [production] Production",
            "Confucian Academy — [culture] Culture building, purchasable in Towns",
            "Printing House — [science] Science building, purchasable in Towns"
        ],
        civic: "Seonbi, Seongnihak, Gyeongguk Daejeon, Samgang"
    },
    "Meiji Japan": {
        ability_name: "Goisshin",
        ability: "When you overbuild a Building, receive [science] Science equal to 25% of the new building's [production] Production cost. +30% [production] Production towards constructing Dogo Onsen.",
        attributes: "Militaristic, Scientific",
        units: [
            "Mikasa — battleship that respawns once when destroyed",
            "Zero — long-range fighter, stronger against other fighters"
        ],
        infrastructure: [
            "Zaibatsu — quarter; adjacent buildings gain [gold] Gold and [production] Production",
            "Ginkō — [gold] Gold building with gold-building adjacency",
            "Jukogyo — [production] Production building with coastal adjacency"
        ],
        civic: "Bunmei Kaika, Oath in Five Articles, Supreme War Council, Kantai Kessen"
    },
    "Mexico": {
        ability_name: "Revolución",
        ability: "Starts with the unique Revolución Government: +2 [happiness] Happiness per Age in Cities for each slotted Tradition, and Celebrations grant [culture] Culture in Happy Settlements. Cannot adopt any other Government. +100% Tourism from Celebrations. +30% [production] Production towards constructing Palacio de Bellas Artes.",
        attributes: "Cultural, Diplomatic",
        units: [
            "Soldaderas — support unit healing adjacent units each turn",
            "Revolucionario — unique Great Person"
        ],
        infrastructure: [
            "Zócalo — quarter; [culture] Culture per slotted Tradition",
            "Catedral — [happiness] Happiness building with [culture] Culture adjacency",
            "Portal de Mercaderes — [culture] Culture building with [gold] Gold adjacency"
        ],
        civic: "Planes Políticos, Plan of Iguala, Plan of Ayutla, Plan of Tuxtepec"
    },
    "Mughal India": {
        ability_name: "Paradise of Nations",
        ability: "+100% [gold] Gold from all sources. -25% to all other yields except [food] Food. Can purchase Wonders with [gold] Gold, but they are 150% more expensive. +30% [production] Production towards the Red Fort Wonder.",
        attributes: "Economic, Expansionist",
        units: [
            "Sepoy — infantry with a ranged bombard attack",
            "Zamindar — civilian granting extra Population to new Towns"
        ],
        infrastructure: [
            "Stepwell — improvement; [food] Food, more from adjacent Farms"
        ],
        civic: "Zabt, Jagir, Mansabdari, Gardens of Paradise"
    },
    "Nepal": {
        ability_name: "Roof of the World",
        ability: "Can work Mountain tiles. All Warehouse buildings apply to Mountain tiles, but they cost +1 [gold] Gold and [happiness] Happiness Maintenance. +1 Tourism from Unique Improvements on Mountains. +30% [production] Production towards constructing the Boudhanath.",
        attributes: "Diplomatic, Cultural",
        units: [
            "Gurkha — fast, hard-hitting infantry",
            "Sherpa — scout that crosses Mountains and claims them"
        ],
        infrastructure: [
            "Highland Power Station — mountain improvement; [production] Production and [culture] Culture"
        ],
        civic: "Jyumdo Bagha, Singha Durbar, Gorkhapatra"
    },
    "Ottomans": {
        ability_name: "Devlet-i ʿAlīye-i ʿOsmānīye",
        ability: "When any Leader excavates an Artifact in the Ottomans' territory, they generate an additional Artifact. +3 Combat Strength for Infantry Units and Siege Units when attacking. +30% [production] Production towards constructing Sultanahmet Camii.",
        attributes: "Cultural, Militaristic",
        units: [
            "Janissary — elite infantry that unsettles everyone's [happiness] Happiness",
            "Barbary Corsair — naval raider with free Coastal Raids"
        ],
        infrastructure: [
            "Külliye — quarter; [culture] Culture and [gold] Gold on this city's Specialists",
            "Cami — [culture] Culture building with Great Work slots",
            "Hammam — [happiness] Happiness building with [gold] Gold adjacency"
        ],
        civic: "Şahi Topu, Harbiye Nezâreti, Lâle Devri, Tanẓîmât"
    },
    "Prussia": {
        ability_name: "Blood and Iron",
        ability: "Units receive +1 Combat Strength for every Unfriendly or worse Relationship with other civilizations. You may establish and retain Trade Routes with civilizations that you are at War with. +30% [production] Production towards constructing Brandenburg Gate.",
        attributes: "Militaristic, Diplomatic",
        units: [
            "Hussar — cavalry, stronger per unspent Movement point",
            "Stuka — ground-attack aircraft, strong against land units"
        ],
        infrastructure: [
            "Staatseisenbahn — unique railroad; [gold] Gold and [production] Production on its rural tiles"
        ],
        civic: "Ruhr, Zollverein, Ems Dispatch, Bewegungskrieg"
    },
    "Qajar": {
        ability_name: "Kayānī Crown",
        ability: "+50% [influence] Influence toward supporting Diplomatic Actions. +10 [food] Food and [production] Production in the Capital for every Settlement under the Settlement Limit. +30% [production] Production towards constructing Eram Garden.",
        attributes: "Diplomatic, Expansionist",
        units: [
            "Gholām — infantry, stronger and faster-healing near a Sardār",
            "Sardār — fast commander that razes districts quicker"
        ],
        infrastructure: [
            "Bāq — quarter; [influence] Influence and [culture] Culture during Celebrations",
            "Ghahve Khane — [food] Food building with [happiness] Happiness adjacency",
            "Takyeh — [happiness] Happiness building with [influence] Influence adjacency"
        ],
        civic: "The Sun Throne, Twelve Gates, Neẓām-e J̌adīd"
    },
    "Qing China": {
        ability_name: "Kang Qian Shengshi",
        ability: "+3 [gold] Gold and +3 [culture] Culture for every imported Resource. -6 [science] Science for every Trade Route. +1 GDP per turn for imported Resources assigned to Cities. +1 Combat Strength for Land Units for every other civilization you have a Trade Route with. +30% [production] Production towards constructing Chengde Mountain Resort.",
        attributes: "Economic, Expansionist",
        units: [
            "Gusa — infantry, stronger adjacent to other Gusa",
            "Hangshang — merchant earning extra [gold] Gold from naval Trade Routes"
        ],
        infrastructure: [
            "Huiguan — quarter; +25% [influence] Influence in this settlement",
            "Shiguan — [science] Science building with [happiness] Happiness adjacency",
            "Qianzhuang — [gold] Gold building with gold-building adjacency"
        ],
        civic: "Ten Great Campaigns, Open Customs, Kang Xi Tax Reformation, Stabilizing Frontier"
    },
    "Russia": {
        ability_name: "Prosveshchenie",
        ability: "+1 [culture] Culture on Quarters in Cities, and +1 [science] Science on Quarters in Cities on Tundra. +1 [food] Food on Farms in Towns, and +1 [production] Production on Farms in Towns on Tundra, counting as a Warehouse bonus. +30% [production] Production towards constructing the Hermitage.",
        attributes: "Cultural, Scientific",
        units: [
            "Cossack — cavalry, stronger in friendly territory",
            "Katyusha Rocket Launcher — fast, long-range siege unit with splash damage"
        ],
        infrastructure: [
            "Obshchina — improvement; [food] Food on this settlement's Farms, [culture] Culture on Tundra"
        ],
        civic: "Serfdom, Table of Ranks, Samoderzhaviye"
    },
    "Siam": {
        ability_name: "Itsaraphab",
        ability: "Gains a unique Diplomatic Action to immediately become Suzerain of a City-State at a higher [influence] Influence cost than Befriend Independent. +3 [influence] Influence for every civilization you are Friendly or Helpful with. +12 Tourism for every City-State you are Suzerain of. +30% [production] Production towards constructing Doi Suthep.",
        attributes: "Cultural, Diplomatic",
        units: [
            "Chang Beun — ranged war elephant that attacks twice per turn",
            "Uparat — unique Great Person"
        ],
        infrastructure: [
            "Bang — improvement; [culture] Culture and [happiness] Happiness"
        ],
        civic: "Nine Gems, Mandala, Sriwilai"
    }
};

window.leaderBonuses = {
    "Alexander the Great": {
        ability_name: "King of the World",
        ability: "Cities other than your Capital with a Wonder get +10% [production] Production and [culture] Culture, doubled if they are on a different continent than your Capital.\n+2 Combat Strength for Land Military Units.\n+1 Combat Strength (maximum 6) for Unique Military Units and +2 Dominion for every City with a Wonder other than your Capital.\nTowns converted into cities are renamed after Alexander.",
        attributes: "Cultural, Militaristic",
        agenda: "Godlike Basileus"
    },
    "Amina": {
        ability_name: "Warrior-Queen of Zazzau",
        ability: "+1 Resource Capacity in Cities. +1 [gold] Gold per Age for each Resource assigned to Cities. +5 Combat Strength on all Units in Plains and Desert.",
        attributes: "Economic, Militaristic",
        agenda: "Desert of the Warrior Queen"
    },
    "Ashoka (World Conqueror)": {
        ability_name: "Devaraja",
        ability: "+1 [production] Production in Cities for every 5 excess [happiness] Happiness. +10% [production] Production in Settlements not founded by you. Declaring a Formal War grants a Celebration. +5 Combat Strength against Fortified Districts for all Units during a Celebration.",
        attributes: "Diplomatic, Militaristic",
        agenda: "Without Regret"
    },
    "Ashoka (World Renouncer)": {
        ability_name: "Dhammaraja",
        ability: "+1 [food] Food in Cities for every 5 excess [happiness] Happiness.\n+10% [food] Food in Happy Settlements during a Celebration, or 15% in Joyous, or 20% in Ecstatic.\nUnique, [food] Food and [happiness] Happiness Buildings gain a +1 [happiness] Happiness adjacency for all Improvements.",
        attributes: "Diplomatic, Expansionist",
        agenda: "Without Sorrow"
    },
    "Augustus": {
        ability_name: "Imperium Maius",
        ability: "+2 [production] Production in the Capital for every Town.\nCan purchase Culture Buildings in Towns with any Town focus.\n+15% [gold] Gold towards purchasing Buildings in Towns, doubled if that Building is present in your Capital.",
        attributes: "Cultural, Expansionist",
        agenda: "Restitutor Orbis"
    },
    "Benjamin Franklin": {
        ability_name: "The First American",
        ability: "+1 [science] Science per Age on Production and Science Buildings in Cities.\n+5% [production] Production towards constructing Buildings for active Endeavors you started or supported.\n+2 [science] Science per Age from active Endeavors you started or supported.\nCan have two Endeavors of the same type active at a time.",
        attributes: "Diplomatic, Scientific",
        agenda: "Civic Virtue"
    },
    "Catherine the Great": {
        ability_name: "Star of the North",
        ability: "+2 [culture] Culture per Age on displayed Great Works. Buildings and Wonders with Great Work slots gain 1 additional slot. Cities settled in Tundra gain [science] Science equal to 25% of their [culture] Culture per turn.",
        attributes: "Cultural, Scientific",
        agenda: "Dusha"
    },
    "Charlemagne": {
        ability_name: "Father of Europe",
        ability: "Military and Science Buildings receive +1 [happiness] Happiness adjacency for Fortifications.\nGain 2 Cavalry Units, once unlocked, when entering a Celebration.\n+5 Combat Strength for Cavalry Units during a Celebration.",
        attributes: "Militaristic, Scientific",
        agenda: "The Golden Shepherd"
    },
    "Confucius": {
        ability_name: "Keju",
        ability: "+25% Growth Rate in all Cities. +2 [science] Science from Specialists.",
        attributes: "Expansionist, Scientific",
        agenda: "Guanxi"
    },
    "Edward Teach": {
        ability_name: "Blackbeard",
        ability: "All Naval Units gain the Pirate Ability, which allows them to cross borders of other civilizations, Plunder Trade Routes from non-allied civilizations, and attack Naval Units of non-allied civilizations without declaring War.\nDefeating any Naval Unit with your own Naval Units provides [gold] Gold equal to 50% of the defeated unit's Combat Strength and captures that Unit under your control.\n+1 [gold] Gold Maintenance for Naval Units.",
        attributes: "Militaristic, Economic",
        agenda: "Queen Anne's Revenge"
    },
    "Friedrich (Oblique)": {
        ability_name: "Berlin Academy",
        ability: "Army Commanders start with the Merit Commendation, granting them +1 Command Radius.\nGain an Infantry Unit when you complete a Tech Mastery or construct a Science Building.\n+2 [science] Science per Age for each Commendation earned by your Commanders.",
        attributes: "Militaristic, Scientific",
        agenda: "To Arms!"
    },
    "Friedrich (Baroque)": {
        ability_name: "Hohenfriedberger Marsch",
        ability: "Gain a Great Work upon capturing a Settlement for the first time. +1 [culture] Culture per Age on displayed Great Works. Gain an Infantry Unit when you complete a Civic Mastery or construct a Culture Building.",
        attributes: "Militaristic, Cultural",
        agenda: "Parisian Sensibilities"
    },
    "Genghis Khan": {
        ability_name: "Chosen of Tengri",
        ability: "+3 Combat Strength for Cavalry Units, or +5 when in a Command Radius. Army Commanders have +1 Movement even when no Units are packed into them. Once per Age, Army Commanders can use the Convert Independents action to convert adjacent Independent Military Units to your control.",
        attributes: "Militaristic, Expansionist",
        agenda: "Tümen"
    },
    "Gilgamesh": {
        ability_name: "Once Mortal, Twice Divine",
        ability: "+2 War Support when you have exactly one Ally. When you defeat an enemy Unit, gain [influence] Influence equal to 50% of its Combat Strength. All basic Endeavors are unlocked; Endeavors with Allies don't count against the limit of having one Endeavor of a given type active at a time. Allies can support your Endeavors for free.",
        attributes: "Diplomatic, Militaristic",
        agenda: "Ally of Enkidu"
    },
    "Harriet Tubman": {
        ability_name: "Combahee Raid",
        ability: "+100% [influence] Influence towards initiating Espionage actions. Gain a Migrant in the Capital whenever you complete an Espionage action without being detected. Gain 5 War Support on all Wars declared against you. Units ignore Movement penalties from Vegetation.",
        attributes: "Diplomatic, Militaristic",
        agenda: "Veracity"
    },
    "Hatshepsut": {
        ability_name: "God's Wife of Amun",
        ability: "+1 [culture] Culture per Age for every unique Resource. +15% [production] Production towards the construction of Buildings and Wonders in Cities adjacent to Navigable Rivers.",
        attributes: "Cultural, Economic",
        agenda: "Wonders of Iteru"
    },
    "Himiko (High Shaman)": {
        ability_name: "Miko of Amaterasu",
        ability: "+2 [happiness] Happiness per Age on Happiness and Diplomacy Buildings, doubled if a Building is both. +50% [production] Production towards constructing Happiness and Diplomacy Buildings, doubled if a Building is both. +15% [culture] Culture but -15% [science] Science. These effects are doubled during a Celebration.",
        attributes: "Cultural, Diplomatic",
        agenda: "Shaman Queen"
    },
    "Himiko (Queen of Wa)": {
        ability_name: "Friend of Wei",
        ability: "Gain a unique Endeavor, Friend of Wei, which can be performed in an Alliance to grant you and your ally +25% [science] Science.\nCan support Endeavors for free, but rejecting Diplomatic Actions costs +100% [influence] Influence.\n+4 [science] Science per Age for every leader you're Friendly or Helpful with.",
        attributes: "Diplomatic, Scientific",
        agenda: "Yamatai"
    },
    "Ibn Battuta": {
        ability_name: "The Marvels of Traveling",
        ability: "Gains 2 Wildcard Attribute Points after the first Civic in every Age.\n+1 Sight for all Units.\nGain a unique Endeavor called Trade Map that lets you gradually see other Leaders' claimed territory.",
        attributes: "Expansionist, Wildcard",
        agenda: "Far and Wide"
    },
    "Isabella": {
        ability_name: "Seven Cities of Gold",
        ability: "Gain 100 [gold] Gold per Age every time you discover a Natural Wonder, doubled if the Natural Wonder is in distant lands. +50% tile yields from Natural Wonders per Natural Wonder in your empire. +50% [gold] Gold towards purchasing Naval Units, and -1 [gold] Gold maintenance for Naval Units.",
        attributes: "Economic, Expansionist",
        agenda: "Wonderlust"
    },
    "José Rizal": {
        ability_name: "Pambansang Bayani",
        ability: "When gaining rewards from a Narrative Event, gain an additional +20 [culture] Culture, [gold] Gold and [influence] Influence per Age. +50% Celebration duration and [happiness] Happiness towards Celebrations. Has additional Narrative Events.",
        attributes: "Cultural, Diplomatic",
        agenda: "Kapwa"
    },
    "Lafayette": {
        ability_name: "Hero of Two Worlds",
        ability: "Gains a unique Endeavor, Reform, which grants an additional Tradition slot. Supporting this Endeavor also grants the other Leader an additional Tradition slot, otherwise they are granted a Social Policy Slot. +1 Combat Strength for all Units for each Tradition, but not Policy, slotted in the Government. +1 [culture] Culture and [happiness] Happiness per Age in Settlements, doubled for Settlements in distant lands.",
        attributes: "Cultural, Diplomatic",
        agenda: "French Quarters"
    },
    "Lakshmibai": {
        ability_name: "Rani of Jhansi",
        ability: "+50% [influence] Influence towards initiating the City-State - Incorporate Action. Gain control of all the City-State's Units when performing the Incorporate Action. When one of your Land Military Units defeats an enemy Unit, gain [influence] Influence equal to 100% of its Combat Strength.",
        attributes: "Militaristic, Diplomatic",
        agenda: "Eternal Glory"
    },
    "Machiavelli": {
        ability_name: "Il Principe",
        ability: "Gain +3 [influence] Influence per Age. Gain 50 [gold] Gold per Age when your Diplomatic Action proposals are accepted, or 100 [gold] Gold per Age when they are rejected. Ignore Relationship requirements for declaring Formal Wars. You can Levy Military Units from City-States you are not suzerain of.",
        attributes: "Diplomatic, Economic",
        agenda: "The Spider"
    },
    "Napoleon (Revolutionary)": {
        ability_name: "Enemy of the Coalitions",
        ability: "+1 Movement for all Land Units. Defeating an enemy Unit provides [culture] Culture equal to 100% of its Combat Strength. The first time each Age that a War is declared against you, gain an Army Commander in your Capital packed with 1 Infantry, Cavalry, Ranged and Siege Unit, even if those Units have not been unlocked.",
        attributes: "Militaristic, Cultural",
        agenda: "Culture from Conquest"
    },
    "Napoleon (Emperor)": {
        ability_name: "Continental System",
        ability: "+50% [influence] Influence towards initiating Sanctions. +5 [culture] Culture and [gold] Gold per Age for each leader you have an active Sanction on except Denouncement. +1 Combat Strength for all Land Units for every Sanction you have active, except Denouncement. All basic Sanctions are automatically unlocked.",
        attributes: "Economic, Diplomatic",
        agenda: "Napoleonic Code"
    },
    "Pachacuti": {
        ability_name: "Earth Shaker",
        ability: "All Buildings gain a [food] Food adjacency for Mountains. -2 [happiness] Happiness maintenance on Specialists adjacent to Mountains. +1 [happiness] Happiness maintenance on Specialists not adjacent to Mountains. Cities gain a bonus to [production] Production equal to 10% of that City's [food] Food.",
        attributes: "Economic, Expansionist",
        agenda: "Mountain King"
    },
    "Ada Lovelace": {
        ability_name: "Enchantress of Numbers",
        ability: "Cities receive +2 [science] Science per Age after you complete a Civic Mastery. This resets at the start of each Age. Gain [culture] Culture equal to 100% of your total [science] Science per turn when you complete a Technology Mastery.",
        attributes: "Cultural, Scientific",
        agenda: "Analytical Engine"
    },
    "Sayyida al Hurra": {
        ability_name: "Hakima Tatwan",
        ability: "Receive the strongest Naval Unit every time you complete an Espionage Action, if you can place a Naval Unit. Naval Units stationed on a District provide +2 [culture] Culture and +1 [influence] Influence per Age. No [influence] Influence penalty for your Espionage being revealed. Opponents cannot use Counter Spy against you.",
        attributes: "Militaristic, Diplomatic",
        agenda: "Wattasid Dynasty"
    },
    "Simón Bolívar": {
        ability_name: "El Libertador",
        ability: "Gain 2 War Support on Wars you declare. When you conquer a Settlement for the first time, the Settlement can purchase 1 Building or Improvement for free. Unrest does not prevent Purchasing.",
        attributes: "Militaristic, Expansionist",
        agenda: "Cornerstone of Freedom"
    },
    "Tecumseh": {
        ability_name: "Nicaakiyakoolaakwe",
        ability: "+1 [food] Food per Age in Towns and +1 [production] Production per Age in Cities for every City-State you are suzerain of. +1 Combat Strength for all Infantry Units and Ranged Units for every City-State you are Suzerain of. +2 Dominion for every City-State you are suzerain of. All Independent Powers start Friendly with you.",
        attributes: "Militaristic, Diplomatic",
        agenda: "Suzerain of the World"
    },
    "Toyotomi Hideyoshi": {
        ability_name: "Great Unifier",
        ability: "Land Units deal double Damage against opposing Civilization's Units, but take double Damage from these Units when defending. Your Units gain +5 additional Healing, doubled on Culture Buildings or Wonders. +25% [production] Production towards Culture Buildings, doubled in Cities not founded by you.",
        attributes: "Militaristic, Cultural",
        agenda: "Kampaku"
    },
    "Trung Trac": {
        ability_name: "Hai Bà Trung",
        ability: "Gain a unique Commander, Trung Nhi, after the first Military Unit of the Age is produced. Your Commanders gain +20% experience. +10% [science] Science in Cities on Tropical tiles; this bonus is doubled during any Formal War you declare.",
        attributes: "Militaristic, Scientific",
        agenda: "Van Minh"
    },
    "Xerxes (King of Kings)": {
        ability_name: "Crusher of Rebellions",
        ability: "+3 Combat Strength for Units that are attacking in neutral or enemy territory. +100 [culture] Culture and [gold] Gold per Age upon capturing a Settlement for the first time. +10% [gold] Gold in all Settlements, doubled in Captured Settlements from any Age. +1 Settlement Limit each Age.",
        attributes: "Economic, Militaristic",
        agenda: "Lord of Fire"
    },
    "Xerxes (The Achaemenid)": {
        ability_name: "Silk Road",
        ability: "+1 Trade Route Limit with all other leaders. +10 Trade Range. +50 [culture] Culture and +100 [gold] Gold per Age when you create a Trade Route or Road. +1 [culture] Culture and [gold] Gold per Age on unique Buildings and unique Tile Improvements.",
        attributes: "Cultural, Economic",
        agenda: "Lord of Coin"
    },
    "Yi Sun-sin": {
        ability_name: "Samdo Sugun Tongjesa",
        ability: "Can construct Fleet Commanders after studying Discipline in Antiquity. Receive a Fleet Commander once you have discovered Discipline and have a Harbor Building with access to the Ocean. Defeating an enemy with a Naval Unit provides [science] Science equal to 100% of the defeated unit's Combat Strength. On construction of Science Buildings receive 10 XP to all Fleet Commanders. +3 [gold] Gold per Age for every Fleet Commander XP earned in Combat.",
        attributes: "Militaristic, Scientific",
        agenda: "13 Ships"
    }
};
