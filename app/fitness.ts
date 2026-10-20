import variants from './training-variants.json';import specialtyExercises from './specialty-exercises.json';
import apartmentExercises from './apartment-exercises.json';import {apartmentPlan} from './apartment-training';
import {createDayPlan} from './training-program';
import {exerciseKey,type TrainingExercise} from './exercise-library';
export type Profile={age:number;weight:number;height:number;sex:'male'|'female';activity:number;goal:string;target:number;training:string;duration:number;start:string;baseWeight:number;progress:string;eligible?:boolean;rate?:number;zigzag?:boolean;weekendExtra?:number;baseMiles?:number;runPace?:number};
export const localDate=(d=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
export function mealForTime(date=new Date()){const hour=Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',hourCycle:'h23'}).format(date));return hour>=7&&hour<11?'Breakfast':hour>=11&&hour<15?'Lunch':hour>=16&&hour<22?'Dinner':'Snack';}
export const dateKey=(d:Date)=>d.toISOString().slice(0,10);
export const defaults:Profile={age:'' as any,weight:'' as any,height:'' as any,sex:'male',activity:1.375,goal:'Maintain weight',target:0,training:'Muscular hypertrophy',duration:45,start:'',baseWeight:'' as any,progress:'Hold',rate:1,zigzag:false,weekendExtra:250,baseMiles:6,runPace:12};
export const trainingGoals=['Stabilization & muscular endurance','Muscular hypertrophy','Maximal strength','Power & speed','Weight management','Marathon base conditioning','HYROX conditioning','1RM strength practice','HIIT conditioning','Mobility & balance'];
export function normalizeProfile(p:any):Profile{return {...defaults,...p,start:p.start||localDate(),training:({'Build muscle':'Muscular hypertrophy','Speed & agility':'Power & speed','Cut weight':'Weight management','Marathon base':'Marathon base conditioning'} as any)[p.training]||p.training||defaults.training};}
export function calorieTarget(p:Profile){if(!p.age||!p.weight||!p.height)return {resting:0,maintenance:0,target:0};const resting=10*Number(p.weight)+6.25*Number(p.height)-5*Number(p.age)+(p.sex==='male'?5:-161),maintenance=resting*Number(p.activity);const adjustment=p.goal==='Maintain weight'?0:(p.goal==='Lose weight'?-1:1)*500*(p.rate??1);return {resting:Math.round(resting),maintenance:Math.round(maintenance),target:Math.round(maintenance+adjustment)};}
export function calorieWeek(p:Profile){const average=Number(p.target)||0;const extra=p.zigzag?Math.max(0,Number(p.weekendExtra??250)):0;return Array.from({length:7},(_,i)=>average?(i<5?average-extra*2/5:average+extra):0);}
export function dailyTarget(p:Profile,date:string){return Math.round(calorieWeek(p)[(new Date(date+'T12:00:00Z').getUTCDay()+6)%7]);}
export const greeting=(now=new Date())=>{const h=Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',hourCycle:'h23'}).format(now));return h>=6&&h<12?'Good morning':h>=12&&h<18?'Good afternoon':'Good evening';};
export const longDate=(date:string)=>new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric',year:'numeric'}).replace(',',' -');
export const excelDate=(date:string)=>date.slice(5,7)+'/'+date.slice(8,10)+'/'+date.slice(0,4);
const ex=(name:string,group:string,motion:string,cue:string,type='strength',gif=''):TrainingExercise=>({name,group,motion,cue,type,gif});
const baseExercises:TrainingExercise[]=[
ex('Dumbbell bench press','Chest','press','Feet planted; lower beside chest with elbows 30–60° from torso. Press with wrists stacked.','strength','bench.gif'),
ex('Incline dumbbell press','Chest','press','Set bench 15–30°. Lower toward upper chest, keep shoulders back and press without arching.','strength','incline.gif'),
ex('Dumbbell chest fly','Chest','fly','Use light weights and soft elbows. Open only to a comfortable stretch; bring arms together.','strength',''),
ex('Dumbbell row','Back','row','Support your free hand, keep spine neutral; pull toward hip and lower slowly.','strength','row.gif'),
ex('Bodyweight squat','Legs','squat','Keep heels grounded and knees over toes. Sit between hips, then stand.','strength','squats.gif'),
ex('Reverse lunge','Legs','lunge','Step back, lower both knees and push through the front foot. Alternate legs.','strength','lunge.gif'),
ex('Push-up','Chest','push','Keep body straight; lower chest between hands. Elevate hands for an easier version.','strength','pushups.gif'),
ex('Plank','Core','plank','Elbows below shoulders, brace and breathe. Stop before the lower back sags.','hold','plank.gif'),
ex('High knees','Conditioning','run','Stay tall and land softly. March for a low-impact alternative.','interval','high_knees.gif'),
ex('Jumping jacks','Conditioning','jack','Land softly; use alternating side steps for a low-impact option.','interval','jumpingjacks.gif'),
ex('Run / walk','Endurance','run','Easy: full sentences. Tempo: comfortably hard short phrases. Use run/walk intervals when needed.','cardio','running.gif'),
ex('Shoulder circles','Mobility','mobility','Slow circles within a pain-free range; keep ribs relaxed.','recovery','mobility.gif'),
ex('Dumbbell biceps curl','Biceps','curl','Keep elbows by ribs. Curl without swinging, then lower slowly.'),
ex('Hammer curl','Biceps','curl','Palms face inward. Keep upper arms still throughout the curl.'),
ex('Dumbbell overhead press','Shoulders','overhead','Brace ribs over hips. Press overhead without leaning back.'),
ex('Dumbbell lateral raise','Shoulders','fly','Use light weights, soft elbows; raise to shoulder level and lower with control.'),
ex('Dumbbell triceps kickback','Triceps','row','Hinge at hips, keep upper arm still; straighten elbow, then return.'),
ex('Overhead triceps extension','Triceps','overhead','Hold a light dumbbell, bend elbows behind head; extend without flaring ribs.'),
ex('Dumbbell Romanian deadlift','Posterior chain','hinge','Soft knees, hips move back. Keep weights close and spine neutral; stand through hips.'),
ex('Goblet squat','Legs','squat','Hold one dumbbell close to chest. Sit between hips and stand tall.'),
ex('Glute bridge','Glutes','bridge','Lie with knees bent; lift hips by squeezing glutes, without arching the back.'),
ex('Standing calf raise','Calves','calf','Rise onto toes with control, pause, then lower heels. Use support for balance.'),
ex('Dead bug','Core','deadbug','Keep low back gently supported. Extend opposite arm and leg slowly; alternate sides.'),
ex('Bird dog','Core','bird','On hands and knees, extend opposite arm and leg without rotating hips.'),
ex('Side plank','Core','plank','Elbow under shoulder. Lift hips and keep a straight line; use knees for an easier option.','hold'),
ex('Kettlebell deadlift','Posterior chain','hinge','Place bell between feet. Hinge with a neutral spine, grip handle and stand tall.'),
ex('Dumbbell thruster','Full body','squatpress','Use light weights. Squat, stand and press overhead in one controlled sequence.','interval'),
ex('Mountain climber','Full body','push','Hands below shoulders. Alternate knees forward while keeping hips steady.','interval'),
ex('Farmer carry','Full body','carry','Hold weights at sides; walk tall with small controlled steps and relaxed breathing.','hold'),
ex('Step-up','Legs','lunge','Use a stable low step. Drive through the top foot; step down slowly and alternate.'),
ex('Hip circles','Dynamic stretch','mobility','Circle hips slowly, keeping motion comfortable.','recovery'),
ex('Leg swings','Dynamic stretch','legswing','Use support and gently swing each leg forward/back; avoid forcing range.','recovery'),
ex('Walking knee hugs','Dynamic stretch','mobility','Walk slowly, bring one knee toward chest gently, release and alternate.','recovery'),
ex('Treadmill warm-up','Warm-up','run','Walk or jog easily. Warm-up stays conversational; tempo work belongs in the main session.','cardio'),
ex('Rowing machine warm-up','Warm-up','rower','Push with legs, then lean slightly and pull handle. Reverse arms, body, legs on recovery.','cardio'),
ex('Elliptical trainer warm-up','Warm-up','elliptical','Use a light resistance and smooth strides; stay upright.','cardio'),
ex('Stairmaster warm-up','Warm-up','stairs','Start slowly, step fully onto each tread and avoid leaning on the rails.','cardio'),
ex('Chest opener','Recovery','mobility','Open arms gently while keeping ribs down; breathe steadily.','recovery'),
ex('Cat–cow','Recovery','bird','On all fours, slowly round then lengthen the spine within comfort.','recovery'),
ex('Ankle circles','Recovery','calf','Circle each ankle gently, seated or supported.','recovery'),
ex('Hip flexor mobility','Recovery','lunge','Half-kneel, tuck pelvis gently and shift forward slightly without arching.','recovery'),
ex('Thoracic rotation','Recovery','mobility','Rotate upper back gently, keeping hips steady.','recovery'),
ex('Seated hamstring mobility','Recovery','hinge','Hinge gently toward a straight leg. Avoid bouncing.','recovery'),
ex('Child’s pose breathing','Recovery','bird','Sit hips back comfortably and take slow relaxed breaths.','recovery'),
ex('Supported heel-to-toe walk','Recovery','carry','Use nearby support and walk slowly heel to toe.','recovery'),
ex('Gentle marching','Recovery','run','March at an easy pace while breathing comfortably.','recovery'),
ex("Dumbbell floor press","Chest","press","Lie on the floor, elbows stop gently at the floor. Press with wrists stacked."),
ex("Incline push-up","Chest","push","Hands on a stable raised surface; keep a straight body and lower chest toward hands."),
ex("Dumbbell squeeze press","Chest","press","On a flat bench press two light dumbbells together gently, then press above chest."),
ex("Alternating dumbbell curl","Biceps","curl","Keep elbows beside ribs and alternate curls without rocking the torso."),
ex("Concentration curl","Biceps","curl","Seated, rest the upper arm against the inner thigh. Curl slowly without leaning."),
ex("Incline dumbbell curl","Biceps","curl","On a gently inclined bench, let arms hang. Curl with upper arms still and light weights."),
ex("Seated dumbbell curl","Biceps","curl","Sit upright, elbows beside ribs; curl and lower slowly without swinging."),
ex("Chest-supported dumbbell row","Back","row","Lie chest-down on an inclined bench; pull elbows toward hips without lifting chest."),
ex("Bent-over two-dumbbell row","Back","row","Hinge at the hips, keep spine neutral, and row both dumbbells toward the hips."),
ex("Dumbbell reverse fly","Back / shoulders","fly","Hinge and use light weights. Open arms with soft elbows, without shrugging."),
ex("Prone Y raise","Back / shoulders","overhead","Lie chest-down, arms in a Y. Lift gently with thumbs up and avoid arching."),
ex("Dumbbell pullover","Back / chest","overhead","Lie on a bench. With soft elbows move one light weight back only within comfort, then return."),
ex("Lying dumbbell triceps extension","Triceps","overhead","On a bench, keep upper arms still and bend elbows slowly; extend without flaring."),
ex("Close-grip incline push-up","Triceps","push","Hands about shoulder width on a stable raised surface. Keep elbows close to ribs."),
ex("Seated dumbbell shoulder press","Shoulders","overhead","Sit upright with back supported; press without arching and lower with control."),
ex("Dumbbell front raise","Shoulders","overhead","With light weights and soft elbows, raise arms only to shoulder level; lower slowly."),
ex("Dumbbell shrug","Shoulders / traps","carry","Raise shoulders straight up gently, pause and lower; do not roll shoulders."),
ex("Dumbbell split squat","Legs","lunge","Use a split stance; lower straight down and push through the front foot. Alternate sides."),
ex("Walking dumbbell lunge","Legs","lunge","With light weights, step forward and lower both knees. Stand and step through without rushing."),
ex("Lateral lunge","Legs","lunge","Step sideways, sit hips back over that leg, then push back to center. Alternate sides."),
ex("Single-leg Romanian deadlift","Posterior chain","hinge","Use support and a light weight. Hinge on one leg with level hips, then stand."),
ex("Sumo goblet squat","Legs","squat","Hold one light weight, feet comfortably wide and toes angled out. Knees track over toes."),
ex("Single-leg glute bridge","Glutes","bridge","Lift hips with one foot grounded. Keep pelvis level; use both legs if needed."),
ex("Side-lying hip abduction","Glutes","legswing","Lie on your side and lift the top leg slowly with toes pointing forward."),
ex("Wall sit","Legs","squat","Back against a wall, slide to a comfortable knee bend and hold while breathing.","hold"),
ex("Kettlebell suitcase carry","Full body","carry","Carry one light bell at your side, staying tall without leaning. Switch sides.","hold"),
ex("Bodyweight good morning","Posterior chain","hinge","Soft knees, hinge hips back with a long spine, then stand."),
ex("Step jack","Conditioning","jack","Step one foot out at a time while raising arms comfortably.","interval"),
ex("Alternating reverse lunge to knee drive","Legs","lunge","Step back into a shallow lunge, stand and bring the knee forward; no jump needed.","interval"),
ex("Dumbbell squat to calf raise","Legs","squat","Use light weights. Stand from a squat then rise onto toes with control.","interval"),
ex("Standing punch interval","Conditioning","mobility","With no weights, alternate easy punches at shoulder height; keep elbows soft.","interval"),
ex("Lateral step-over","Conditioning","lunge","Step side to side over an imaginary low line, landing softly.","interval"),
ex("Kettlebell sumo deadlift","Full body","hinge","With a wide comfortable stance, hinge and stand with the bell close to you.","interval"),
ex("Dumbbell alternating overhead press","Full body","overhead","Use light weights and alternate pressing without leaning or rushing.","interval"),
ex("Standing hip abduction","Recovery","legswing","Use support; lift one leg gently sideways without leaning.","recovery"),
ex("Seated trunk rotation","Recovery","mobility","Sit tall and rotate gently from the upper back; stay within a comfortable range.","recovery")
];
export const exercises:TrainingExercise[]=[...baseExercises,...specialtyExercises,...apartmentExercises,...variants.filter(v=>!apartmentExercises.some(e=>exerciseKey(e.name)===exerciseKey(v.name))&&!specialtyExercises.some(e=>exerciseKey(e.name)===exerciseKey(v.name))&&!baseExercises.some(e=>exerciseKey(e.name)===exerciseKey(v.name)))];
export function weekStart(date:string){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d;}
export const mainExerciseCount=(minutes:number)=>minutes<=30?6:minutes<=45?8:minutes<=60?10:12;
export function dayPlan(raw:Profile,date:string){const p=normalizeProfile(raw);return apartmentPlan(p,date,exercises,createDayPlan(p,date,exercises));}

export const sources=[['HYROX official race format','https://hyrox.com/the-fitness-race/'],['ACE interval training evidence','https://www.acefitness.org/resources/pros/expert-articles/6361/high-intensity-interval-training-why-it-works/'],['WHO adult activity and balance guidance','https://www.who.int/publications/i/item/9789240015128'],['NASM goal-specific OPT principles','https://www.nasm.org/certified-personal-trainer/the-opt-model'],['Calorie methods · Calculator.net','https://www.calculator.net/calorie-calculator.html'],['USDA FoodData Central','https://fdc.nal.usda.gov/'],['ACSM resistance training guidance','https://acsm.org/resistance-training-guidelines-update-2026/'],['NASM HIIT programming','https://www.nasm.org/resource-center/blog/training/hiit-programming-a-trainers-guide-to-building-effective-intervals'],['ACE progression & warm-up','https://www.acefitness.org/resources/everyone/blog/5453/5-exercise-mistakes-that-could-get-you-hurt/'],['ACE cardio progression','https://www.acefitness.org/certifiednewsarticle/709/ace-ift-model-for-cardiorespiratory-training-phases-1-4/'],['NSCA fatigue & deload discussion','https://www.nsca.com/education/podcasts/nsca-coaching-podcast/nsca-s-coaching-podcast-season-9/season-9-episode-18/']];
