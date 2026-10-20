export type CookingMethod='stir'|'soup'|'salad'|'steam'|'braise'|'roast'|'grain'|'pancake'|'curry'|'noodle'|'dip';
export type DietRecipe={id:string;name:string;ingredients:string[];method:CookingMethod;fiberFoods:string[];recipeSource?:string};
export type DietCollection={id:string;name:string;region:string;asian:boolean;description:string;tip:string;recipes:DietRecipe[]};
const fiberWords=/beans?|lentils?|chickpeas?|peas|edamame|tempeh|cabbage|broccoli|greens|spinach|bok choy|eggplant|okra|mushrooms?|carrots?|pumpkin|squash|gourd|radish|lotus|bamboo|oats|barley|quinoa|brown rice|whole.wheat|berries|apples?|pears?|chia|flax|nuts|almonds|walnuts|avocado|artichoke|cauliflower|asparagus|fennel|beets?|sweet potato|corn|buckwheat|millet|bulgur|farro|watercress|papaya|banana blossom|jackfruit|green papaya|long beans|nopales|lupini|hominy|plantain|malanga|yuca|jicama|purslane|quelites/i;
function collection(id:string,name:string,region:string,asian:boolean,description:string,tip:string,rows:string):DietCollection{
 const recipes=rows.trim().split('\n').filter(Boolean).map((row,i)=>{const [title,foods,method='stir']=row.split('|');const ingredients=foods.split(',').map(s=>s.trim());return {id:id+'-'+(i+1),name:title,ingredients,method:method as CookingMethod,fiberFoods:ingredients.filter(food=>fiberWords.test(food))};});
 return {id,name,region,asian,description,tip,recipes};
}
// Original Seediva cooking outlines, not reproductions of publisher recipes. Named dishes retain their cuisine;
// fiber suggestions are plate pairings, rather than invented "authentic" substitutions or measured nutrient claims.
export const dietCollections:DietCollection[]=[
collection('chinese','Chinese home cooking','China',true,'Regional Chinese home cooking offers many vegetable, tofu and bean dishes. Build a varied table with a vegetable side, a protein dish and a suitable portion of rice or noodles.','Choose steamed or quickly stir-fried vegetables often; measure oil and salty sauces. Serve brown rice alongside the traditional dish if you enjoy it.',`
Garlic bok choy|bok choy,garlic,neutral oil,light soy sauce|stir
Smashed cucumber salad|cucumber,garlic,rice vinegar,sesame oil|salad
Mapo tofu|firm tofu,ground pork,doubanjiang,Sichuan pepper,garlic|braise
Di san xian|eggplant,potato,green pepper,garlic,soy sauce|stir
Tomato and egg stir-fry|tomato,eggs,scallion,neutral oil|stir
Garlic broccoli|broccoli,garlic,neutral oil,light soy sauce|stir
Shiitake bok choy|shiitake mushrooms,bok choy,ginger,soy sauce|braise
Hot and sour soup|tofu,wood ear mushrooms,bamboo shoots,egg,black vinegar|soup
Lotus root stir-fry|lotus root,carrot,wood ear mushrooms,rice vinegar|stir
Celery and dried tofu|celery,pressed tofu,garlic,soy sauce|stir
Chinese cabbage with vinegar|napa cabbage,dried chili,garlic,black vinegar|stir
Snow peas with mushrooms|snow peas,shiitake mushrooms,ginger,neutral oil|stir
Steamed eggplant|eggplant,garlic,black vinegar,light soy sauce|steam
Winter melon soup|winter melon,shiitake mushrooms,dried shrimp,ginger|soup
Spinach and peanut salad|spinach,peanuts,garlic,black vinegar|salad
Stir-fried shredded potato|potato,green pepper,garlic,rice vinegar|stir
Dry-fried green beans|green beans,ground pork,garlic,Sichuan pepper|stir
Chinese okra with garlic|okra,garlic,light soy sauce,neutral oil|steam
Mung bean soup|mung beans,water,dried tangerine peel|soup
Eight-treasure congee|brown rice,mung beans,red beans,lotus seeds,peanuts|grain
Red bean congee|red beans,rice,water|grain
Millet pumpkin porridge|millet,pumpkin,water|grain
Bitter melon with egg|bitter melon,eggs,garlic,neutral oil|stir
Chinese chive and egg|Chinese chives,eggs,neutral oil|stir
Bamboo shoots with mushrooms|bamboo shoots,shiitake mushrooms,ginger,light soy sauce|braise
Wood ear mushroom salad|wood ear mushrooms,cucumber,garlic,black vinegar|salad
Steamed fish with ginger|white fish,ginger,scallion,light soy sauce|steam
Watercress pork soup|watercress,lean pork,ginger,water|soup
Soybean sprout stir-fry|soybean sprouts,garlic,scallion,neutral oil|stir
Luffa and tofu soup|luffa gourd,tofu,ginger,water|soup
`),
collection('japanese','Japanese','Japan',true,'Japanese meals often combine rice, soup and several small dishes. Beans, sea vegetables and seasonal vegetables add variety; fish and tofu can provide protein.','Enjoy miso and soy sauce in modest amounts. Edamame, vegetables and mixed-grain rice can help build a fiber-containing meal.',`
Edamame|edamame pods,water,pinch of salt|steam
Kinpira gobo|burdock root,carrot,sesame seeds,soy sauce,mirin|stir
Gomaae spinach|spinach,sesame seeds,soy sauce|salad
Hijiki simmered salad|hijiki seaweed,carrot,soybeans,aburaage,soy sauce|braise
Kabocha no nimono|kabocha squash,dashi,soy sauce,mirin|braise
Nasu nibitashi|eggplant,dashi,ginger,soy sauce|braise
Kenchinjiru|tofu,daikon,carrot,burdock root,shiitake mushrooms|soup
Vegetable miso soup|miso,tofu,wakame,daikon,carrot|soup
Tonjiru|lean pork,daikon,carrot,burdock root,miso|soup
Okinawan goya champuru|bitter melon,firm tofu,egg,bonito flakes|stir
Shiitake takikomi gohan|rice,shiitake mushrooms,carrot,aburaage,dashi|grain
Sekihan|glutinous rice,azuki beans,sesame seeds|grain
Mugi gohan|rice,pearl barley,water|grain
Zaru soba|buckwheat soba,scallion,nori,dashi,soy sauce|noodle
Hiyayakko|silken tofu,ginger,scallion,bonito flakes|salad
Yudofu|tofu,kombu,napa cabbage,shiitake mushrooms|soup
Komatsuna ohitashi|komatsuna greens,dashi,soy sauce|salad
Sunomono|cucumber,wakame,rice vinegar,sesame seeds|salad
Namasu|daikon,carrot,rice vinegar|salad
Shiraae|tofu,spinach,carrot,sesame paste|salad
Renkon kinpira|lotus root,carrot,sesame oil,soy sauce|stir
Daikon nimono|daikon,dashi,soy sauce,ginger|braise
Chawanmushi|eggs,dashi,shiitake mushrooms,shrimp|steam
Saba shioyaki|mackerel,lemon,daikon,pinch of salt|roast
Salmon shioyaki|salmon,lemon,pinch of salt|roast
Shishito peppers|shishito peppers,neutral oil,bonito flakes|stir
Natto rice|natto,rice,scallion,nori|grain
Mushroom suimono|shiitake mushrooms,enoki mushrooms,dashi,scallion|soup
Steamed satsumaimo|Japanese sweet potato,water|steam
Okra ohitashi|okra,dashi,soy sauce,bonito flakes|salad
`),
collection('korean','Korean','Korea',true,'Korean home meals offer soups, rice and banchan: small vegetable and protein side dishes. Choose a mix of colors and include beans, tofu or fish.','Fermented foods and sauces can be salty. Balance smaller portions of kimchi and sauces with unsalted vegetables and multigrain rice.',`
Kongnamul muchim|soybean sprouts,garlic,scallion,sesame oil|salad
Sigeumchi namul|spinach,garlic,sesame seeds,sesame oil|salad
Oi muchim|cucumber,gochugaru,garlic,rice vinegar|salad
Gaji namul|eggplant,garlic,scallion,soy sauce|steam
Hobak bokkeum|zucchini,garlic,scallion,sesame oil|stir
Beoseot bokkeum|mushrooms,garlic,scallion,soy sauce|stir
Musaengchae|radish,gochugaru,garlic,rice vinegar|salad
Miyeok guk|wakame seaweed,beef,garlic,sesame oil|soup
Doenjang jjigae|tofu,zucchini,mushrooms,doenjang,onion|soup
Sundubu jjigae|soft tofu,mushrooms,clams,gochugaru,egg|soup
Kongbiji jjigae|ground soybeans,kimchi,lean pork,scallion|soup
Kongnamul guk|soybean sprouts,garlic,scallion,anchovy broth|soup
Mu guk|radish,lean beef,garlic,scallion|soup
Japgokbap|rice,barley,black beans,millet|grain
Boribap|barley,rice,water|grain
Vegetable bibimbap|rice,spinach,soybean sprouts,carrot,egg,gochujang|grain
Sanchae bibimbap|rice,fernbrake,bellflower root,spinach,sesame oil|grain
Yeongeun jorim|lotus root,soy sauce,rice syrup,sesame seeds|braise
Geomeun kong jorim|black soybeans,soy sauce,sesame seeds|braise
Dubu jorim|firm tofu,soy sauce,garlic,scallion,gochugaru|braise
Dubu kimchi|tofu,kimchi,onion,sesame oil|stir
Buchujeon|garlic chives,flour,water,neutral oil|pancake
Pajeon|scallion,flour,egg,water,neutral oil|pancake
Kimchi jeon|kimchi,flour,scallion,water|pancake
Baechu guk|napa cabbage,doenjang,garlic,anchovy broth|soup
Kkaennip jjim|perilla leaves,soy sauce,garlic,scallion|steam
Mugwort soup|mugwort greens,doenjang,clam broth|soup
Doraji muchim|bellflower root,cucumber,gochujang,rice vinegar|salad
Godeungeo gui|mackerel,lemon,pinch of salt|roast
Ssambap|rice,lettuce,perilla leaves,tofu,ssamjang|grain
`),
collection('indian','Indian','India',true,'Indian regional cooking includes many pulses, vegetables and whole-grain breads. Dal, chana and bean dishes are useful plant-protein and fiber building blocks.','Keep the traditional spices; adjust portions of ghee, oil and salty pickles. Pair dal with vegetables and an appropriate serving of rice or roti.',`
Chana masala|chickpeas,tomato,onion,cumin,garam masala|curry
Rajma|kidney beans,tomato,onion,ginger,cumin|curry
Moong dal tadka|mung dal,turmeric,cumin,garlic,tomato|soup
Masoor dal|red lentils,turmeric,onion,tomato,cumin|soup
Palak dal|lentils,spinach,garlic,cumin,turmeric|soup
Sambar|toor dal,drumstick pods,eggplant,tamarind,sambar powder|soup
Rasam|tomato,tamarind,cumin,black pepper,curry leaves|soup
Chole palak|chickpeas,spinach,tomato,cumin|curry
Lobia curry|black-eyed peas,onion,tomato,ginger,cumin|curry
Kala chana curry|black chickpeas,tomato,onion,cumin|curry
Baingan bharta|eggplant,tomato,onion,ginger,cumin|roast
Bhindi masala|okra,onion,tomato,cumin,turmeric|stir
Aloo gobi|potato,cauliflower,ginger,cumin,turmeric|stir
Patta gobi matar|cabbage,peas,cumin,turmeric|stir
Beans poriyal|green beans,grated coconut,mustard seeds,curry leaves|stir
Carrot poriyal|carrot,grated coconut,mustard seeds,curry leaves|stir
Beetroot thoran|beetroot,coconut,cumin,curry leaves|stir
Avial|carrot,green beans,ash gourd,coconut,yogurt,curry leaves|braise
Vegetable kootu|moong dal,pumpkin,coconut,cumin|braise
Sundal|chickpeas,coconut,mustard seeds,curry leaves|stir
Kosambari|soaked moong dal,cucumber,carrot,lemon|salad
Kachumber|cucumber,tomato,onion,lemon,coriander|salad
Methi thepla|whole-wheat flour,fenugreek leaves,yogurt,cumin|pancake
Palak paratha|whole-wheat flour,spinach,cumin,water|pancake
Besan chilla|chickpea flour,onion,tomato,coriander,water|pancake
Moong dal chilla|soaked mung dal,ginger,cumin,coriander|pancake
Vegetable upma|semolina,peas,carrot,mustard seeds,curry leaves|grain
Vegetable poha|flattened rice,peas,peanuts,onion,turmeric|grain
Khichdi|rice,moong dal,carrot,peas,turmeric|grain
Bajra roti|pearl millet flour,warm water|pancake
`),
collection('thai','Thai','Thailand',true,'Thai food balances herbs, sourness, heat and savory seasonings. Vegetable dishes, clear soups and smaller portions of rich curries can fit a varied eating pattern.','Use fish sauce and curry paste thoughtfully. Add a separate vegetable dish rather than changing the identity of a traditional recipe.',`
Som tam Thai|green papaya,tomato,long beans,lime,peanuts,fish sauce|salad
Yam makhuea yao|eggplant,shallot,lime,fish sauce,coriander|salad
Tom yum mushrooms|mushrooms,lemongrass,galangal,lime leaves,lime|soup
Tom kha gai|chicken,mushrooms,coconut milk,galangal,lime leaves|soup
Gaeng liang|pumpkin,luffa gourd,baby corn,basil,shrimp paste|soup
Gaeng som vegetables|cauliflower,long beans,green papaya,tamarind,curry paste|curry
Pad pak ruam|broccoli,carrot,baby corn,mushrooms,garlic|stir
Pad pak bung|water spinach,garlic,chili,soybean paste|stir
Pad kana|Chinese broccoli,garlic,oyster sauce|stir
Pad fak tong|pumpkin,garlic,egg,Thai basil|stir
Larb gai|minced chicken,lime,mint,shallot,toasted rice powder|salad
Larb hed|mushrooms,lime,mint,shallot,toasted rice powder|salad
Yam tua pu|winged beans,shrimp,coconut milk,lime,peanuts|salad
Yam wun sen|glass noodles,celery,tomato,shrimp,lime|noodle
Nam prik ong|tomato,minced pork,chili,garlic,shallot|dip
Nam prik noom|green chili,garlic,shallot,lime|dip
Miang kham|betel leaves,ginger,lime,peanuts,toasted coconut|salad
Pla neung manao|white fish,lime,garlic,chili,coriander|steam
Gaeng jued tofu|tofu,napa cabbage,carrot,glass noodles,garlic|soup
Khao tom pla|rice,white fish,celery,ginger,garlic|soup
Pad krapao tofu|firm tofu,holy basil,garlic,chili,soy sauce|stir
Tao hoo song kreung|tofu,mushrooms,carrot,baby corn,garlic|braise
Khai jiao cha om|eggs,cha om leaves,fish sauce,neutral oil|pancake
Khao yam|rice,lemongrass,long beans,pomelo,toasted coconut|grain
Yam som o|pomelo,shrimp,shallot,lime,toasted coconut|salad
Pad tua ngoh|mung bean sprouts,tofu,garlic,scallion|stir
Pad makhuea yao|eggplant,Thai basil,garlic,chili,soy sauce|stir
Gaeng pa gai|chicken,eggplant,long beans,bamboo shoots,jungle curry paste|curry
Yam cucumber|cucumber,shallot,lime,chili,fish sauce|salad
Tom jab chai|Chinese cabbage,daikon,shiitake mushrooms,tofu,soy sauce|braise
`),
collection('vietnamese','Vietnamese','Vietnam',true,'Vietnamese meals feature fresh herbs, vegetables, broths and rice. Bean dishes, vegetable sides and herb-rich plates create variety without relying on large amounts of oil.','Broths, dipping sauces and pickles can add sodium. Taste before adding more sauce and include plenty of vegetables.',`
Goi cuon|rice paper,shrimp,rice vermicelli,lettuce,mint|salad
Goi du du|green papaya,carrot,Thai basil,lime,peanuts|salad
Goi ngo sen|lotus stems,carrot,shrimp,mint,lime|salad
Goi bap chuoi|banana blossom,cabbage,peanuts,mint,lime|salad
Goi ga|chicken,cabbage,onion,mint,lime|salad
Rau muong xao toi|water spinach,garlic,neutral oil|stir
Dau que xao toi|green beans,garlic,neutral oil|stir
Cai thia xao nam|bok choy,shiitake mushrooms,garlic,soy sauce|stir
Su su xao|chayote,carrot,garlic,neutral oil|stir
Canh chua ca|fish,tomato,pineapple,okra,tamarind,bean sprouts|soup
Canh bi dao|winter melon,shrimp,scallion,water|soup
Canh bau|bottle gourd,shrimp,scallion,water|soup
Canh cai xanh|mustard greens,ginger,lean pork,water|soup
Canh mong toi|Malabar spinach,shrimp,luffa gourd,water|soup
Canh rau den|amaranth greens,shrimp,garlic,water|soup
Dau hu sot ca chua|tofu,tomato,garlic,scallion|braise
Dau hu kho nam|tofu,shiitake mushrooms,soy sauce,black pepper|braise
Ca tim nuong mo hanh|eggplant,scallion,neutral oil,fish sauce|roast
Bap cai luoc|cabbage,water,ginger|steam
Rau lang luoc|sweet potato leaves,water|steam
Cha la lot|lean beef,betel leaves,lemongrass,shallot|roast
Bo la lot|beef,betel leaves,lemongrass,garlic|roast
Bun cha gio chay|rice noodles,vegetable spring rolls,lettuce,herbs,carrot|noodle
Bun thit nuong|rice noodles,grilled pork,lettuce,herbs,peanuts|noodle
Pho chay|rice noodles,tofu,mushrooms,bok choy,star anise|soup
Chao dau xanh|rice,mung beans,ginger,water|grain
Chao nam|rice,mushrooms,ginger,scallion|grain
Xoi dau den|glutinous rice,black beans,sesame seeds|grain
Che dau xanh|mung beans,water,pandan,small amount of sugar|soup
Nom rau muong|water spinach,peanuts,lime,garlic,fish sauce|salad
`),
collection('indonesian','Indonesian','Indonesia',true,'Indonesia has a rich range of regional vegetable, tempeh and tofu dishes. Build meals around vegetables and pulses, with coconut-rich sauces in portions that suit your needs.','Tempeh and vegetables offer fiber-containing choices. Peanut sauces and coconut milk are flavorful but energy-dense, so serve thoughtfully.',`
Gado-gado|long beans,cabbage,bean sprouts,tofu,peanut sauce|salad
Karedok|cucumber,long beans,cabbage,bean sprouts,peanuts|salad
Urap sayur|spinach,long beans,bean sprouts,grated coconut|salad
Pecel sayur|spinach,bean sprouts,long beans,peanut sauce|salad
Sayur asem|tamarind,long beans,corn,chayote,peanuts|soup
Sayur bening bayam|amaranth greens,corn,shallot,water|soup
Sayur lodeh|eggplant,long beans,chayote,tofu,coconut milk|curry
Tumis kangkung|water spinach,garlic,shallot,chili|stir
Tumis buncis|green beans,carrot,garlic,shallot|stir
Tumis tauge|bean sprouts,tofu,garlic,scallion|stir
Tumis labu siam|chayote,garlic,shallot,galangal|stir
Cap cai|cabbage,carrot,cauliflower,mushrooms,garlic|stir
Tempe bacem|tempeh,coriander,galangal,palm sugar,soy sauce|braise
Tempe orek|tempeh,shallot,garlic,chili,kecap manis|stir
Pepes tahu|tofu,basil,shallot,chili,banana leaf|steam
Pepes ikan|fish,basil,lemongrass,shallot,banana leaf|steam
Botok tempe|tempeh,grated coconut,petai cina,banana leaf|steam
Soto ayam|chicken,cabbage,bean sprouts,turmeric,lemongrass|soup
Sup kacang merah|kidney beans,carrot,celery,tomato|soup
Sup oyong|luffa gourd,glass noodles,shrimp,garlic|soup
Acar kuning|cucumber,carrot,shallot,turmeric,vinegar|braise
Terong balado|eggplant,tomato,chili,shallot|braise
Perkedel jagung|corn,flour,egg,scallion,garlic|pancake
Bubur kacang hijau|mung beans,pandan,water,coconut milk|grain
Bubur Manado|rice,pumpkin,corn,spinach,basil|grain
Nasi jagung|rice,corn,water|grain
Lalapan|cucumber,cabbage,basil,tomato,sambal|salad
Plecing kangkung|water spinach,tomato,chili,lime,peanuts|salad
Lawar nangka|young jackfruit,green beans,coconut,shallot|salad
Jukut undis|black pigeon peas,shallot,garlic,galangal|soup
`),
collection('malaysian','Malaysian','Malaysia',true,'Malaysian cooking reflects distinct Malay, Chinese and Indian traditions. Vegetable sides, lentil dishes and ulam provide many ways to build a plant-rich plate.','Include ulam or cooked vegetables and choose portions of rice, coconut gravies and sweet sauces that fit your appetite.',`
Ulam with sambal belacan|cucumber,winged beans,herbs,lime,sambal belacan|salad
Kerabu taugeh|bean sprouts,carrot,grated coconut,lime|salad
Kerabu mangga|green mango,shallot,peanuts,lime|salad
Kerabu kacang botol|winged beans,shallot,lime,coconut|salad
Kerabu pucuk paku|fiddlehead ferns,coconut,lime,shallot|salad
Sayur campur|cabbage,carrot,cauliflower,garlic|stir
Kangkung belacan|water spinach,garlic,chili,belacan|stir
Kacang panjang goreng|long beans,garlic,shallot,chili|stir
Terung sambal|eggplant,tomato,chili,shallot|braise
Labu masak lemak|pumpkin,coconut milk,turmeric,lemongrass|curry
Sayur lodeh Malaysia|cabbage,long beans,tofu,tempeh,coconut milk|curry
Sup sayur|carrot,cabbage,potato,celery,garlic|soup
Sup kacang dhal|yellow lentils,tomato,onion,turmeric|soup
Dalca sayur|lentils,eggplant,carrot,potato,curry leaves|curry
Rasam Malaysia|tomato,tamarind,cumin,pepper,curry leaves|soup
Sambal tempeh|tempeh,chili,shallot,tamarind|stir
Tauhu sambal|tofu,chili,tomato,shallot|braise
Tauhu kukus|tofu,ginger,scallion,soy sauce|steam
Ikan singgang|fish,turmeric,galangal,tamarind|soup
Ikan bakar|fish,turmeric,lemongrass,lime|roast
Asam pedas ikan|fish,okra,tomato,tamarind,chili|curry
Otak-otak|fish,egg,coconut milk,laksa leaves,banana leaf|steam
Nasi ulam|rice,herbs,long beans,toasted coconut|grain
Nasi kerabu|rice,cabbage,long beans,herbs,coconut|grain
Bubur lambuk|rice,lean beef,carrot,celery,spices|grain
Hakka lei cha rice|rice,green beans,cabbage,tofu,peanuts,tea leaves|grain
Popiah|spring roll wrappers,jicama,carrot,tofu,lettuce|salad
Choy sum with garlic|choy sum,garlic,neutral oil|stir
Okra with sambal|okra,chili,shallot,lime|steam
ABC soup|carrot,potato,tomato,onion,chicken|soup
`),
collection('filipino','Filipino','Philippines',true,'Filipino home cooking includes leafy soups, mung bean stews and vegetable dishes alongside rice and protein. Explore regional vegetable dishes rather than treating one dish as a complete diet.','Choose more vegetables and mung beans; balance salty condiments and fried foods with soups and steamed sides.',`
Ginisang monggo|mung beans,malunggay leaves,tomato,onion,garlic|soup
Pinakbet|eggplant,okra,bitter melon,squash,long beans,bagoong|braise
Dinengdeng|malunggay leaves,eggplant,okra,squash,fish broth|soup
Laswa|squash,okra,long beans,leafy greens,shrimp|soup
Utan bisaya|squash,eggplant,okra,malunggay leaves,water|soup
Ginisang ampalaya|bitter melon,eggs,tomato,onion|stir
Ginisang sayote|chayote,carrot,garlic,onion|stir
Ginisang pechay|bok choy,garlic,onion,tomato|stir
Ginisang upo|bottle gourd,garlic,onion,tomato|stir
Ginisang sitaw|long beans,garlic,onion,tomato|stir
Adobong kangkong|water spinach,garlic,vinegar,soy sauce|stir
Adobong sitaw|long beans,garlic,vinegar,soy sauce|braise
Adobong puso ng saging|banana blossom,garlic,vinegar,pepper|braise
Laing|dried taro leaves,coconut milk,ginger,chili|braise
Ginataang kalabasa at sitaw|squash,long beans,coconut milk,ginger|curry
Ensaladang talong|eggplant,tomato,onion,vinegar|salad
Ensaladang pipino|cucumber,onion,vinegar,pepper|salad
Ensaladang labanos|radish,tomato,onion,vinegar|salad
Ensaladang pako|edible fern,tomato,onion,vinegar|salad
Atchara|green papaya,carrot,ginger,vinegar|salad
Tortang talong|eggplant,eggs,neutral oil|pancake
Tortang dulong with malunggay|dulong fish,eggs,malunggay leaves,onion|pancake
Sinigang na bangus|milkfish,tamarind,radish,okra,kangkong|soup
Sinigang na hipon|shrimp,tamarind,radish,eggplant,water spinach|soup
Tinolang manok|chicken,green papaya,malunggay leaves,ginger|soup
Tinolang isda|fish,ginger,tomato,leafy greens|soup
Pesang isda|fish,bok choy,ginger,potato,peppercorns|soup
Lumpiang sariwa|fresh wrappers,jicama,carrot,green beans,lettuce,tofu|salad
Nilagang baka|lean beef,cabbage,potato,green beans,onion|soup
Inihaw na bangus|milkfish,tomato,onion,calamansi|roast
`),
collection('mediterranean','Mediterranean','Mediterranean',false,'A Mediterranean pattern emphasizes vegetables, fruit, legumes, whole grains, olive oil and nuts, with fish and other proteins. It is an eating pattern rather than a single country’s cuisine.','Build fiber through beans, lentils, vegetables and whole grains. Olive oil and nuts are useful foods, but portions still matter.',`
Greek lentil soup|lentils,tomato,carrot,onion,olive oil|soup
Fasolada|white beans,carrot,celery,tomato,olive oil|soup
Gigantes plaki|giant beans,tomato,onion,parsley,olive oil|roast
Revithada|chickpeas,onion,lemon,olive oil|braise
Fakes salad|lentils,tomato,cucumber,parsley,lemon|salad
Horiatiki|tomato,cucumber,pepper,olives,feta|salad
Spanakorizo|spinach,rice,dill,lemon,olive oil|grain
Briam|zucchini,eggplant,potato,tomato,olive oil|roast
Horta vrasta|leafy greens,lemon,olive oil|steam
Fasolakia lathera|green beans,tomato,onion,olive oil|braise
Tabbouleh|parsley,bulgur,tomato,mint,lemon|salad
Fattoush|lettuce,tomato,cucumber,radish,pita,sumac|salad
Hummus|chickpeas,tahini,lemon,garlic|dip
Baba ganoush|eggplant,tahini,lemon,garlic|dip
Mujaddara|lentils,rice,onion,cumin|grain
Loubieh bi zeit|green beans,tomato,onion,olive oil|braise
Shorbat adas|red lentils,onion,carrot,cumin,lemon|soup
Ribollita|white beans,kale,cabbage,whole-grain bread,tomato|soup
Minestrone|beans,zucchini,carrot,tomato,whole-wheat pasta|soup
Pasta e ceci|chickpeas,pasta,tomato,rosemary|soup
Pasta e fagioli|beans,pasta,celery,tomato|soup
Tuscan white bean salad|white beans,red onion,parsley,olive oil,lemon|salad
Caponata|eggplant,celery,tomato,capers,olives|braise
Ratatouille|eggplant,zucchini,pepper,tomato,thyme|braise
Socca|chickpea flour,water,olive oil,black pepper|pancake
Escalivada|eggplant,peppers,onion,olive oil|roast
Espinacas con garbanzos|spinach,chickpeas,garlic,paprika,cumin|braise
Gazpacho|tomato,cucumber,pepper,olive oil,vinegar|dip
Sardines with lemon|sardines,lemon,parsley,olive oil|roast
Whole-wheat pasta primavera|whole-wheat pasta,peas,asparagus,tomato,olive oil|noodle
`),
collection('american','American balanced','United States',false,'A balanced American-style plate can include familiar soups, grain bowls and vegetable sides. Choose minimally processed ingredients often and include beans, whole grains and seasonal produce.','Aim for a colorful plate with vegetables, a protein source and whole grains or starchy vegetables. Adjust portions to your needs.',`
Three-bean chili|kidney beans,black beans,pinto beans,tomato,chili powder|braise
Turkey and bean chili|lean turkey,kidney beans,tomato,pepper,onion|braise
Black bean soup|black beans,onion,carrot,cumin,tomato|soup
Split pea soup|split peas,carrot,celery,onion|soup
Vegetable barley soup|barley,carrot,celery,tomato,green beans|soup
Chicken vegetable soup|chicken,carrot,celery,peas,onion|soup
Lentil vegetable soup|lentils,carrot,spinach,tomato,onion|soup
White bean kale soup|white beans,kale,carrot,onion|soup
Corn and bean salad|corn,black beans,tomato,pepper,lime|salad
Quinoa harvest bowl|quinoa,squash,kale,chickpeas,pumpkin seeds|grain
Farro vegetable bowl|farro,broccoli,carrot,white beans,lemon|grain
Wild rice mushroom pilaf|wild rice,mushrooms,onion,celery|grain
Brown rice black bean bowl|brown rice,black beans,lettuce,tomato,avocado|grain
Oatmeal with berries|rolled oats,milk,berries,walnuts|grain
Apple cinnamon oatmeal|rolled oats,apple,cinnamon,milk|grain
Pear walnut porridge|rolled oats,pear,walnuts,milk|grain
Overnight chia oats|oats,chia seeds,milk,berries|grain
Sweet potato black bean bake|sweet potato,black beans,tomato,cheddar|roast
Stuffed bell peppers|bell peppers,brown rice,lentils,tomato|roast
Roasted Brussels sprouts|Brussels sprouts,olive oil,black pepper|roast
Roasted broccoli|broccoli,olive oil,garlic,lemon|roast
Roasted root vegetables|carrot,beetroot,parsnip,olive oil,thyme|roast
Collard greens and beans|collard greens,white beans,onion,garlic|braise
Green beans almondine|green beans,almonds,lemon,olive oil|stir
Lentil sloppy joes|lentils,tomato,onion,whole-grain buns|braise
Black bean burgers|black beans,oats,onion,cumin,egg|pancake
Salmon and asparagus|salmon,asparagus,lemon,olive oil|roast
Chicken and vegetable tray bake|chicken,broccoli,carrot,potato,olive oil|roast
Tuna white bean salad|tuna,white beans,celery,lemon,olive oil|salad
Whole-grain vegetable pasta|whole-wheat pasta,zucchini,tomato,spinach,olive oil|noodle
`),
collection('vegetarian','Vegetarian','Plant-forward',false,'Vegetarian eating excludes meat and fish but may include eggs and dairy. Make protein, iron, calcium and vitamin B12 part of your planning, alongside varied plant foods.','Use beans, lentils, tofu, eggs or dairy for protein. Fiber comes from plant ingredients; cheese-heavy meals do not automatically provide much fiber.',`
Lentil shepherd’s pie|lentils,carrot,peas,potato,onion|roast
Chickpea spinach stew|chickpeas,spinach,tomato,onion|braise
White bean mushroom skillet|white beans,mushrooms,garlic,parsley|stir
Lentil walnut salad|lentils,walnuts,carrot,parsley,lemon|salad
Quinoa chickpea salad|quinoa,chickpeas,cucumber,tomato,lemon|salad
Barley roasted vegetable bowl|barley,carrot,squash,chickpeas|grain
Farro mushroom pilaf|farro,mushrooms,onion,parsley|grain
Spinach ricotta whole-grain pasta|whole-wheat pasta,spinach,ricotta,garlic|noodle
Broccoli pea pasta|whole-wheat pasta,broccoli,peas,olive oil|noodle
Lentil tomato pasta|whole-wheat pasta,lentils,tomato,onion|noodle
Black bean sweet potato chili|black beans,sweet potato,tomato,cumin|braise
Pumpkin white bean soup|pumpkin,white beans,onion,vegetable broth|soup
Carrot lentil soup|carrot,red lentils,ginger,vegetable broth|soup
Pea mint soup|peas,potato,onion,mint|soup
Mushroom barley soup|mushrooms,barley,carrot,onion|soup
Stuffed zucchini|zucchini,bulgur,chickpeas,tomato|roast
Lentil stuffed eggplant|eggplant,lentils,tomato,onion|roast
Portobello bean bake|portobello mushrooms,white beans,spinach,mozzarella|roast
Chickpea vegetable frittata|eggs,chickpeas,spinach,pepper|roast
Broccoli cheddar frittata|eggs,broccoli,onion,cheddar|roast
Swiss chard white beans|Swiss chard,white beans,garlic,lemon|stir
Roasted cauliflower tahini|cauliflower,tahini,lemon,parsley|roast
Beet lentil bowl|beetroot,lentils,arugula,feta,walnuts|grain
Egg and avocado toast|whole-grain bread,egg,avocado,tomato|grain
Savory oat bowl|oats,mushrooms,spinach,egg|grain
Cottage cheese berry oats|oats,cottage cheese,berries,flaxseed|grain
Pear almond yogurt bowl|plain yogurt,pear,almonds,oats|salad
Chickpea cucumber pita|chickpeas,cucumber,whole-wheat pita,yogurt|salad
Butter bean tomato bake|butter beans,tomato,spinach,feta|roast
Roasted squash lentil salad|squash,lentils,arugula,pumpkin seeds|salad
`),
collection('vegan','Vegan','Plant-based',false,'Vegan eating excludes animal-derived foods. Beans, soy foods, grains, nuts, seeds and vegetables create variety; reliable vitamin B12 and attention to other key nutrients are important.','Include a substantial plant protein and a calcium source. Choose fortified products when appropriate; unfortified plant foods are not a reliable B12 source.',`
Smoky black bean stew|black beans,tomato,pepper,onion,paprika|braise
Red lentil carrot pot|red lentils,carrot,tomato,garlic|soup
Chickpea pumpkin stew|chickpeas,pumpkin,tomato,cumin|braise
White bean rosemary soup|white beans,carrot,celery,rosemary|soup
Split pea vegetable pot|split peas,carrot,potato,onion|soup
Kale chickpea soup|kale,chickpeas,tomato,garlic|soup
Tempeh broccoli skillet|tempeh,broccoli,garlic,lemon|stir
Tofu cabbage skillet|tofu,cabbage,carrot,garlic|stir
Tofu mushroom bake|tofu,mushrooms,onion,olive oil|roast
Lentil mushroom loaf|lentils,mushrooms,oats,ground flaxseed|roast
Chickpea oat patties|chickpeas,oats,carrot,ground flaxseed|pancake
White bean herb spread|white beans,lemon,parsley,olive oil|dip
Beet chickpea hummus|chickpeas,beetroot,tahini,lemon|dip
Roasted carrot lentil dip|carrot,red lentils,tahini,lemon|dip
Black bean corn salsa|black beans,corn,tomato,lime|salad
Quinoa black bean bowl|quinoa,black beans,avocado,pepper|grain
Millet vegetable pilaf|millet,peas,carrot,onion|grain
Bulgur parsley chickpea bowl|bulgur,chickpeas,parsley,tomato|grain
Brown rice lentil pilaf|brown rice,lentils,onion,cumin|grain
Buckwheat mushroom bowl|buckwheat,mushrooms,kale,walnuts|grain
Roasted vegetable farro|farro,zucchini,pepper,chickpeas|grain
Whole-grain walnut pasta|whole-wheat pasta,walnuts,spinach,garlic|noodle
Pea basil pasta|whole-wheat pasta,peas,basil,olive oil|noodle
Tomato butter bean pasta|whole-wheat pasta,butter beans,tomato,garlic|noodle
Chia berry pudding|chia seeds,fortified soy milk,berries|grain
Apple flax oats|oats,apple,ground flaxseed,fortified soy milk|grain
Banana peanut porridge|oats,banana,peanut butter,fortified soy milk|grain
Roasted cauliflower chickpeas|cauliflower,chickpeas,cumin,olive oil|roast
Sweet potato lentil bake|sweet potato,lentils,tomato,onion|roast
Warm Brussels sprout bean salad|Brussels sprouts,white beans,walnuts,lemon|salad
`),
collection('dash','DASH / lower sodium','Balanced eating pattern',false,'DASH emphasizes vegetables, fruit, whole grains, beans, nuts, and suitable low-fat dairy or alternatives. Lower sodium choices and an overall balanced pattern matter more than a single recipe.','Use no-salt-added beans and broth, rinse canned beans, and flavor with herbs, garlic, spices and citrus. These recipes have no added salt in the outlines.',`
Lemon herb lentil salad|lentils,cucumber,tomato,parsley,lemon|salad
No-salt chickpea vegetable soup|no-salt-added chickpeas,carrot,celery,unsalted vegetable broth|soup
White bean lemon mash|no-salt-added white beans,lemon,garlic,olive oil|dip
Herbed quinoa pilaf|quinoa,peas,carrot,parsley|grain
Brown rice mushroom pilaf|brown rice,mushrooms,onion,thyme|grain
Oatmeal blueberry bowl|oats,blueberries,low-fat milk,walnuts|grain
Apple bran porridge|oat bran,apple,cinnamon,low-fat milk|grain
Pear chia yogurt|plain low-fat yogurt,pear,chia seeds|salad
Berry flax yogurt bowl|plain low-fat yogurt,berries,ground flaxseed|salad
Lentil vegetable skillet|lentils,zucchini,tomato,garlic|stir
Black bean pepper salad|no-salt-added black beans,pepper,corn,lime|salad
Roasted beet barley salad|beetroot,barley,arugula,lemon|salad
Garlic green beans|green beans,garlic,lemon,olive oil|stir
Paprika roasted chickpeas|no-salt-added chickpeas,paprika,olive oil|roast
Cumin roasted carrots|carrot,cumin,olive oil|roast
Herb roasted cauliflower|cauliflower,parsley,lemon,olive oil|roast
Rosemary sweet potato|sweet potato,rosemary,olive oil|roast
Lemon asparagus|asparagus,lemon,olive oil|roast
Garlic kale white beans|kale,no-salt-added white beans,garlic,lemon|stir
Tomato lentil soup|lentils,no-salt-added tomato,onion,unsalted broth|soup
Pea carrot barley soup|barley,peas,carrot,unsalted broth|soup
Pumpkin chickpea soup|pumpkin,no-salt-added chickpeas,ginger,unsalted broth|soup
Lemon baked fish|white fish,lemon,parsley,olive oil|roast
Dill salmon with broccoli|salmon,broccoli,dill,lemon|roast
Herb chicken vegetable bake|chicken,carrot,zucchini,thyme|roast
Turkey vegetable patties|lean turkey,oats,carrot,parsley|pancake
Spinach mushroom egg bake|eggs,spinach,mushrooms,low-fat milk|roast
Avocado white bean toast|whole-grain low-sodium bread,no-salt-added white beans,avocado,lemon|grain
Whole-grain tomato pasta|whole-wheat pasta,no-salt-added tomato,zucchini,basil|noodle
Walnut apple cabbage slaw|cabbage,apple,walnuts,plain yogurt,lemon|salad
`),
collection('keto','Keto / very low carbohydrate','Diet pattern',false,'Ketogenic eating sharply limits carbohydrate and usually increases fat. It is not necessary for everyone and can make fiber harder to obtain; focus on non-starchy vegetables, seeds and nuts.','These are lower-carbohydrate meal ideas, not calculated keto prescriptions. Portions and total daily carbohydrate determine whether a meal fits your plan. Discuss major restrictions with your clinician when relevant.',`
Spinach mushroom omelet|eggs,spinach,mushrooms,olive oil|pancake
Broccoli egg bake|eggs,broccoli,cheddar,cream|roast
Asparagus frittata|eggs,asparagus,parsley,olive oil|roast
Zucchini goat cheese frittata|eggs,zucchini,goat cheese,basil|roast
Avocado egg salad|avocado,eggs,celery,lemon|salad
Salmon avocado salad|salmon,avocado,lettuce,cucumber|salad
Tuna celery lettuce cups|tuna,celery,lettuce,plain yogurt|salad
Chicken cabbage slaw|chicken,cabbage,cucumber,olive oil,lemon|salad
Turkey spinach skillet|ground turkey,spinach,mushrooms,garlic|stir
Garlic shrimp zucchini|shrimp,zucchini,garlic,olive oil|stir
Lemon fish and broccoli|white fish,broccoli,lemon,olive oil|roast
Salmon asparagus tray bake|salmon,asparagus,lemon,olive oil|roast
Chicken cauliflower tray bake|chicken,cauliflower,rosemary,olive oil|roast
Tofu bok choy skillet|firm tofu,bok choy,ginger,garlic|stir
Cauliflower mushroom skillet|cauliflower,mushrooms,garlic,olive oil|stir
Zucchini walnut ribbons|zucchini,walnuts,basil,olive oil|salad
Eggplant tahini plate|eggplant,tahini,lemon,parsley|roast
Roasted cabbage wedges|cabbage,olive oil,garlic,lemon|roast
Broccoli almond side|broccoli,almonds,lemon,olive oil|steam
Garlic sautéed spinach|spinach,garlic,olive oil|stir
Mushroom cream soup|mushrooms,onion,unsalted broth,cream|soup
Broccoli cheddar soup|broccoli,cheddar,unsalted broth,cream|soup
Cauliflower herb soup|cauliflower,unsalted broth,olive oil,parsley|soup
Chia coconut pudding|chia seeds,unsweetened coconut milk,cinnamon|grain
Flax chia porridge|ground flaxseed,chia seeds,unsweetened almond milk|grain
Greek yogurt walnut bowl|plain unsweetened Greek yogurt,walnuts,chia seeds|salad
Avocado cucumber bowl|avocado,cucumber,pumpkin seeds,lime|salad
Roasted radish herb tray|radish,olive oil,thyme|roast
Stuffed portobello eggs|portobello mushrooms,eggs,spinach,cheddar|roast
Chicken lettuce wraps|chicken,lettuce,cucumber,avocado|salad
`)
];
dietCollections.push(
collection('mexican','Mexican','Mexico',false,'Mexican regional cooking includes beans, corn, squash, nopales and many vegetable preparations. Explore traditional dishes and sides together rather than treating a cuisine as one restrictive diet.','Combine a traditional main with beans or vegetables. Measure oil and salty toppings; these outlines do not establish nutrient amounts.',`
Frijoles de olla|pinto beans,onion,garlic,epazote|braise
Frijoles negros de olla|black beans,onion,garlic,epazote|braise
Frijoles refritos|cooked pinto beans,onion,neutral oil|dip
Sopa de frijol negro|cooked black beans,tomato,onion,epazote|soup
Sopa de lentejas|lentils,carrot,tomato,onion|soup
Calabacitas a la mexicana|zucchini,tomato,onion,corn,chile serrano|stir
Calabacitas con elote|zucchini,corn,onion,queso fresco|stir
Nopales a la mexicana|cooked nopales,tomato,onion,chile serrano|stir
Ensalada de nopales|cooked nopales,tomato,onion,cilantro|salad
Nopales con huevo|cooked nopales,eggs,onion,neutral oil|stir
Ejotes con huevo|green beans,eggs,onion,tomato|stir
Verdolagas en salsa verde|purslane,tomatillos,onion,garlic,chile serrano|braise
Quelites con ajo|quelites greens,garlic,onion,neutral oil|stir
Hongos a la mexicana|mushrooms,tomato,onion,chile serrano|stir
Rajas con elote|roasted poblano peppers,corn,onion,cream|stir
Chayotes a la mexicana|chayote,tomato,onion,chile serrano|stir
Sopa de verduras|carrot,zucchini,cabbage,green beans,tomato|soup
Caldo tlalpeño|chicken,chickpeas,carrot,chipotle,avocado|soup
Pozole verde de pollo|hominy,chicken,tomatillos,pumpkin seeds,radish|soup
Pozole rojo|hominy,pork,guajillo chile,cabbage,radish|soup
Sopa de tortilla|corn tortillas,tomato,pasilla chile,avocado,broth|soup
Tinga de pollo|chicken,tomato,onion,chipotle|braise
Pescado a la veracruzana|white fish,tomato,olives,capers,onion|braise
Pescado en hoja de plátano|white fish,tomato,onion,achiote,banana leaf|steam
Ensalada de jícama|jicama,cucumber,lime,chile powder|salad
Guacamole|avocado,onion,cilantro,lime,chile serrano|dip
Pico de gallo|tomato,onion,cilantro,lime,chile serrano|salad
Salsa de pepita|pumpkin seeds,tomatillos,cilantro,chile serrano|dip
Tlacoyos de frijol|masa harina,cooked beans,nopales,salsa|pancake
Tacos de hongos|corn tortillas,mushrooms,onion,epazote,salsa|stir
`),
collection('ecuadorian','Ecuadorian','Ecuador',false,'Ecuadorian coastal and Andean traditions include beans, lupini, corn, quinoa, plantain and vegetable-rich soups. The dishes here span those traditions; serving customs vary by region and household.','Try a bean or chocho salad alongside a main. Choose portions of rice, plantain and potatoes that fit your meal, and use full recipes for specialty preparation.',`
Fanesca|salt cod,cooked beans,peas,squash,corn,milk|soup
Menestra de lentejas|lentils,onion,tomato,cumin,achiote|braise
Menestra de fréjol|red beans,onion,tomato,cumin,achiote|braise
Ensalada de chochos|prepared lupini beans,tomato,onion,lime,cilantro|salad
Chochos con tostado|prepared lupini beans,toasted corn,onion,lime|salad
Cevichocho|prepared lupini beans,tomato,orange,lime,onion|salad
Ensalada de habas|cooked fava beans,onion,tomato,cilantro,lime|salad
Habas con queso|fava beans,fresh cheese,water|steam
Mote con queso|cooked hominy,fresh cheese|grain
Mote pillo|cooked hominy,eggs,onion,milk,achiote|stir
Mote sucio|cooked hominy,pork drippings,onion,garlic|stir
Locro de papa|potatoes,onion,milk,fresh cheese,avocado|soup
Sopa de quinua|quinoa,potato,carrot,onion,milk|soup
Sopa de cebada|barley,potato,carrot,cabbage|soup
Sopa de zapallo|pumpkin,onion,milk,broth|soup
Sopa de arvejas|peas,potato,onion,milk|soup
Repe lojano|green bananas,milk,fresh cheese,cilantro|soup
Repe de arvejas con guineo|green bananas,peas,milk,fresh cheese|soup
Caldo de bolas de verde|green plantain,beef,cabbage,carrot,peanut butter|soup
Sango de verde|green plantain,peanuts,onion,achiote,shrimp|braise
Encebollado|tuna,yuca,onion,tomato,cilantro|soup
Sudado de pescado|white fish,tomato,onion,pepper,cilantro|braise
Pescado encocado|white fish,coconut milk,onion,bell pepper,cilantro|braise
Camarones encocados|shrimp,coconut milk,onion,bell pepper,cilantro|braise
Seco de pollo|chicken,tomato,onion,cilantro,beer|braise
Llapingachos|potatoes,fresh cheese,onion,achiote|pancake
Tigrillo|green plantain,eggs,fresh cheese,onion|stir
Humitas|fresh corn,eggs,cheese,onion,corn husks|steam
Ensalada de remolacha|beets,potatoes,carrot,onion,lime|salad
Curtido de cebolla y tomate|red onion,tomato,lime,cilantro|salad
`),
collection('puerto-rican','Puerto Rican','Puerto Rico',false,'Puerto Rican cooking brings together sofrito, legumes, root vegetables, rice and seafood. Explore vegetable and bean sides with traditional main dishes; not every traditional dish is high in fiber.','Include habichuelas, gandules or a vegetable side when building your plate. Salt cod needs desalting and raw root vegetables need proper cooking; consult a complete recipe.',`
Habichuelas guisadas|red beans,sofrito,pumpkin,tomato sauce,olives|braise
Habichuelas rosadas guisadas|pink beans,sofrito,potato,tomato sauce|braise
Habichuelas blancas guisadas|white beans,sofrito,pumpkin,tomato sauce|braise
Habichuelas negras guisadas|black beans,sofrito,tomato sauce,bay leaf|braise
Gandules guisados|pigeon peas,sofrito,pumpkin,tomato sauce|braise
Garbanzos guisados|chickpeas,sofrito,potato,tomato sauce|braise
Lentejas guisadas|lentils,sofrito,carrot,pumpkin|braise
Arroz con gandules|rice,pigeon peas,sofrito,olives,achiote|grain
Arroz con habichuelas|rice,red beans,sofrito,tomato sauce|grain
Arroz con garbanzos|rice,chickpeas,sofrito,olives|grain
Arroz con maíz|rice,corn,sofrito,broth|grain
Arroz con vegetales|rice,peas,carrot,bell pepper,sofrito|grain
Asopao de gandules|rice,pigeon peas,sofrito,pumpkin,broth|soup
Asopao de pollo|chicken,rice,sofrito,peas,tomato sauce|soup
Asopao de camarones|shrimp,rice,sofrito,bell pepper,tomato sauce|soup
Sancocho|beef,yuca,plantain,malanga,corn,pumpkin|soup
Sopa de pollo boricua|chicken,potato,carrot,sofrito,noodles|soup
Sopa de plátano|green plantain,sofrito,broth,garlic|soup
Crema de calabaza|pumpkin,onion,garlic,broth,milk|soup
Viandas hervidas|yuca,malanga,green banana,sweet potato|steam
Guineos en escabeche|green bananas,onion,vinegar,olive oil,bay leaf|salad
Yuca al mojo|yuca,garlic,olive oil,lime|steam
Berenjena guisada|eggplant,sofrito,tomato sauce,bell pepper|braise
Repollo guisado|cabbage,onion,bell pepper,tomato sauce|braise
Ensalada de aguacate|avocado,tomato,onion,olive oil,vinegar|salad
Ensalada de coditos|elbow macaroni,bell pepper,onion,mayonnaise|noodle
Ensalada de bacalao|desalted cooked salt cod,avocado,tomato,onion,olive oil|salad
Bacalao guisado|desalted salt cod,tomato sauce,onion,bell pepper,potatoes|braise
Pollo guisado|chicken,sofrito,potato,carrot,tomato sauce|braise
Pescado en escabeche|cooked fish,onion,vinegar,olive oil,bay leaf|salad
`)
);
export const cookingOutlines:Record<CookingMethod,string[]>={
 stir:['Wash and cut the vegetables into similar sizes. Drain tofu or cooked beans, if used; slice other protein separately.','Heat a small measured amount of oil in a wide pan. Briefly soften the listed aromatics, then add the firmest vegetables first.','Add tender vegetables and the protein, keeping raw meat or seafood separate from ready-to-eat ingredients until cooked. Stir often; add a splash of water if needed.','Add the listed sauce or acid near the end. Taste before adding salt. Cook until the vegetables are tender and any animal protein reaches a safe internal temperature.'],
 soup:['Wash and chop the vegetables; rinse pulses. Use cooked beans unless the detailed recipe specifically describes cooking dried beans.','Soften the listed aromatics in a little oil or water. Add firm vegetables, pulses and enough water or unsalted broth to cover.','Simmer until the firm ingredients are tender. Add delicate greens, tofu or noodles near the end; cook animal proteins fully.','Season with the listed herbs, spices or acid. Adjust the liquid to your preferred consistency and serve hot.'],
 salad:['Wash all produce and herbs well. Cook any beans, grains, eggs, seafood or meat before combining; cool promptly if serving cold.','Cut or shred the vegetables as appropriate to the dish. Blanch firm greens or sprouts when the traditional preparation calls for it.','Combine the listed acid, aromatics and a modest amount of oil or sauce separately. Toss with the prepared ingredients just before serving.','Add nuts, seeds or fresh herbs at the end. Keep chilled until serving, and check the source recipe for any dish-specific preparation.'],
 steam:['Prepare the vegetables or protein in evenly sized pieces and place in a heatproof dish. Add the listed aromatics.','Bring water to a steady simmer in a steamer. Keep the food above the water; cover while cooking.','Steam until the vegetables are tender and any eggs, meat or seafood are fully cooked. Top up the steamer water when needed.','Carefully remove the hot dish, then add the listed sauce or fresh herbs. Follow the full source recipe for timing and special ingredients.'],
 braise:['Rinse and cut the vegetables. Use cooked pulses, or cook dried pulses separately before starting.','Soften the aromatics with a measured amount of oil. Add the main ingredients and the listed sauce, tomato or spices.','Add enough water or unsalted broth to keep the ingredients moist. Cover and simmer gently, stirring occasionally.','Uncover near the end if the sauce needs thickening. Cook until tender and safely cooked, then finish with herbs or acid.'],
 roast:['Preheat the oven and prepare a baking tray or ovenproof dish. A temperature around 200°C / 390°F suits many vegetable dishes; use the full recipe for delicate fish, eggs and dough.','Cut the vegetables evenly. Combine with the listed herbs or spices and a measured amount of oil; arrange without crowding.','Bake until tender, turning vegetables where useful. Check fish, poultry and eggs for safe doneness rather than relying on browning alone.','Add fresh herbs, lemon or a listed dressing after cooking. For stuffed dishes, cook the pulse or grain filling first.'],
 grain:['Rinse the grain when appropriate. Cook dried beans separately; never rely on a short grain-cooking time to make raw beans safe.','Combine the grain with the amount of water specified on its package. Add firm vegetables or cooked pulses if the dish calls for them.','Simmer gently until tender, stirring porridge often. Add delicate greens, milk or other perishable toppings near the end.','Rest cooked rice or grains briefly before fluffing. Finish with the listed herbs, nuts, seeds or fruit; follow the full recipe for specialty rice dishes.'],
 pancake:['Prepare the listed vegetables finely. For pulse batters, soak and grind only as directed by the full recipe.','Combine the flour, egg or pulse base with the listed ingredients. Add water gradually to make the dough or batter appropriate to the dish.','Heat a nonstick pan with a small measured amount of oil. Cook small portions, turning carefully, until both sides are cooked through.','Serve promptly with a vegetable side. Dough thickness and cooking time vary; consult a full recipe for flatbreads and traditional batters.'],
 curry:['Prepare the vegetables and rinse pulses; use already cooked beans unless following a full dried-bean recipe.','Warm the listed spices or curry paste with a measured amount of oil, then add aromatics and firm ingredients.','Add tomato, broth or coconut milk as listed. Simmer gently until tender, adding delicate greens near the end.','Taste and finish with the listed herbs or acid. Cook any animal protein fully; serve with a suitable portion of your preferred staple.'],
 noodle:['Bring water to a boil and cook noodles according to the package. Drain; rinse only when appropriate for the noodle type.','Prepare vegetables, herbs and sauce ingredients while the noodles cook. Cook all meat, eggs or seafood safely before serving.','For warm noodles, combine briefly in the pan or broth; for cold noodles, cool promptly and toss with the prepared dressing.','Add herbs and crunchy toppings at the end. Keep sauces moderate and include a generous vegetable portion.'],
 dip:['Cook pulses or roast the main vegetable until tender, if the dish requires it; cool enough to handle.','Combine the listed ingredients by blending, mashing or finely chopping according to the dish. For gazpacho, use washed raw produce.','Add lemon, vinegar or water gradually to adjust texture. Taste before adding salt.','Serve with vegetables or a suitable whole-grain side. Refrigerate leftovers promptly.']
};
export const dietSources=[
 {name:'Mexico In My Kitchen: traditional recipe library',url:'https://www.mexicoinmykitchen.com/recipe-index/'},
 {name:'Laylita: Ecuadorian and Latin recipes',url:'https://www.laylita.com/recipes/index/'},
 {name:'Delish D’Lites: Puerto Rican stewed beans',url:'https://www.delishdlites.com/type/latin-recipes/habichuelas-guisadas-puerto-rican-stewed-beans-recipe/'},
 {name:'Harvard Nutrition Source: recipes',url:'https://nutritionsource.hsph.harvard.edu/recipes/'},
 {name:'Mayo Clinic: high-fiber recipes',url:'https://www.mayoclinic.org/healthy-lifestyle/recipes/high-fiber-recipes/rcs-20077194'},
 {name:'Red House Spice: Chinese recipe library',url:'https://redhousespice.com/index/'},
 {name:'Omnivore’s Cookbook: Chinese recipes',url:'https://omnivorescookbook.com/category/recipe/'},
 {name:'Diet types: introductory overview',url:'https://becomeanutritionist.org/blog/types-of-diets/'}
];
