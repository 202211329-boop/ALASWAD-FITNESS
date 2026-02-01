// --- بيانات الشرح والمساعدة ---


const infoData = {
	
    goal: {
        title: "ما هو هدفك؟",
        desc: "تنشيف: يعني أنك تأكل أقل مما تحرق لخسارة الدهون.<br>محافظة: تأكل بقدر ما تحرق لتثبيت الوزن.<br>تضخيم: تأكل أكثر مما تحرق لزيادة الكتلة العضلية."
    },
    vault: {
        title: "الخزنة الأسبوعية",
        desc: "الرصيد المتاح لليوم المفتوح. كل سعرة توفرها يتم تخزينها هنا لتستمتع بها نهاية الأسبوع. (الميزة تتوقف في التضخيم للحفاظ على جودة الأكل)."
    },
    caffeine: {
        title: "بروتوكول الكافيين",
        desc: "1. نافذة التركيز: اشرب القهوة بعد الاستيقاظ بـ 90 دقيقة (لتجنب انهيار الطاقة لاحقاً).<br>2. التوقف: توقف قبل النوم بـ 10 ساعات لضمان جودة النوم العميق."
    },
    analysisDynamic: {
        title: "تنبيه الالتزام",
        desc: "النص المعروض يعتمد على هدفك الحالي. تغيير الخطة لا يعني فقط تأخر النتيجة، بل تغيير *نوع* النتيجة (مثلاً: زيادة دهون بدلاً من عضل في التضخيم)."
    },
    cardio: {
        title: "حساب الكارديو العلمي",
        desc: "نستخدم معادلة ACSM الدقيقة. الانحناء (Incline) يزيد حرق السعرات بنسبة تصل لـ 50% مقارنة بالمشي المستوي."
    },
    weights: {
        title: "تمارين الحديد",
        desc: "الهدف ليس رفع الوزن، بل وضع العضلة تحت توتر. تمارين الفشل العضلي تحفز النمو حتى بأوزان متوسطة."
    },
    bodyBattery: {
        title: "بطارية الجسم (Recovery Score)",
        desc: "مقياس لطاقة جسمك وجاهزيته. ينخفض إذا قل نومك عن 7 ساعات، أو إذا أهملت شرب الماء، أو إذا كانت سعراتك منخفضة جداً. إذا كانت البطارية حمراء، خذ يوم راحة لتجنب الإصابة."
    }
};

// --- تعريف خطوات الجولة ---
const tourSteps = [
    { target: 'battery-container', title: "🧠 بطارية الجسم", desc: "مؤشر طاقتك الحقيقية! ينقص بقلة النوم وقلة الماء، ويزيد بالراحة. لا تتمرن بقوة إذا كان أحمر!" },
    { target: 'caffeine-card', title: "☕ ضبط الكافيين", desc: "لأقصى تركيز: اشرب قهوتك بعد الاستيقاظ بـ 90 دقيقة. وتوقف قبل موعد النوم بـ 10 ساعات." },
    { target: 'macro-water', title: "💧 الماء الذكي", desc: "هدفك ليس ثابتاً! سيزيد النظام هدفك تلقائياً عند تسجيل التمارين لتعويض العرق." },
    { target: 'habit-sun', title: "☀️ عادات الفوز", desc: "عادات صغيرة بتأثير هرموني ضخم. ابدأ يومك بضوء الشمس لضبط نومك ليلاً." },
    { target: 'sleep-panel', title: "📉 ديون النوم", desc: "النظام يحسب الديون المتراكمة عليك. إذا تراكم الدين، سيطلب منك النظام تقليل الجهد لتجنب الإصابة." }
];

// --- مدير الجولة (Tour Manager) ---
const TourManager = {
    step: 0,
    active: false,
    start: function() {
        // تأكد من وجود العنصر في الـ HTML
        if(!document.getElementById('tour-overlay')) {
            console.error("خطأ: عنصر tour-overlay غير موجود في HTML");
            return;
        }
        this.step = 0;
        this.active = true;
        $('tour-overlay').classList.remove('hidden');
        this.render();
    },
    render: function() {
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        const current = tourSteps[this.step];
        const el = document.getElementById(current.target);
        
        // إذا العنصر موجود، نضيئه
        if(el) {
            el.classList.add('tour-highlight');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        $('tour-title').innerText = current.title;
        $('tour-desc').innerHTML = current.desc;
        $('tour-step-count').innerText = `${this.step + 1} / ${tourSteps.length}`;
    },
    next: function() {
        if (this.step < tourSteps.length - 1) {
            this.step++;
            this.render();
        } else {
            this.end();
        }
    },
    skip: function() { this.end(); },
    end: function() {
        this.active = false;
        $('tour-overlay').classList.add('hidden');
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        // حفظ أن المستخدم شاهد الجولة
        state.profile.tourSeen = true;
        saveState();
    }
};

const habitData = {
    salad: {
        title: "لماذا السلطة؟",
        desc: "تناول الخضروات الورقية قبل الوجبة يخلق 'شبكة ألياف' في المعدة تقلل من سرعة امتصاص السكر والدهون، مما يقلل تخزين الدهون."
    },
    sun: {
        title: "شمس الصباح",
        desc: "الضوء الطبيعي صباحاً يرسل إشارة للدماغ لإفراز السيروتونين (للنشاط) ويضبط إفراز الميلاتونين ليلاً (للنوم)."
    },
    walk: {
        title: "المشي بعد الأكل",
        desc: "المشي لمدة 10 دقائق بعد الوجبة يقلل ارتفاع سكر الدم بنسبة 30% ويساعد في الهضم."
    },
    supplements: {
        title: "الأساسيات",
        desc: "الفيتامينات تضمن عمل العمليات الحيوية، والكرياتين يحسن الأداء الذهني والبدني. شرب الماء بكثرة يرفع معدل الحرق."
    },
    veggies: { title: "الخضروات", desc: "مصدر المعادن والفيتامينات الأساسية لعمليات الأيض." },
    fruits: { title: "الفواكه", desc: "مصدر للطاقة السريعة ومضادات الأكسدة التي تحارب الالتهابات." }
};

// --- إدارة الحالة (State Management) ---
const state = {
    screen: 'screen-setup',
    lastDate: '', 
    profile: { name: '', weight: 0, height: 0, age: 0, gender: 'male', goal: 0 },
    targets: { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 }, 
    current: { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0, sleep: 0, sleepDebt: 0, steps: 0, habits: {salad:false, sun:false, walk:false, supplements:false, veggies:false, fruits:false} },
    bank: 0,
    streak: 0
};

// --- أدوات مساعدة ---
const $ = (id) => document.getElementById(id);

const hideAll = () => document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));

const show = (id) => { 
    hideAll(); 
    $(id).classList.add('active'); 
};

const toast = (msg) => {
    const t = document.createElement('div'); 
    t.className = 'toast fade-in'; 
    t.innerText = msg;
    $('toast-box').appendChild(t); 
    setTimeout(() => t.remove(), 4000);
};

const isValidPos = (val) => {
    if (val < 0) { toast("خطأ: لا يمكن إدخال أرقام سالبة!"); return false; }
    return true;
};

// --- وظيفة البحث ---
function openFoodSearch() {
    const goal = state.profile.goal;
    let query = "";
    if (goal < 0) query = "وجبات دايت مشبعة سعرات قليلة";
    else if (goal > 0) query = "وجبات عالية البروتين للتضخيم";
    else query = "وجبات صحية متوازنة";
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
}

// --- وظائف المعلومات ---
function showInfo(key) {
    const data = infoData[key];
    if(data) {
        $('info-title').innerText = data.title;
        $('info-desc').innerHTML = data.desc;
        $('info-modal').classList.remove('hidden');
    }
}

function showHabitInfo(e, key) {
    e.stopPropagation(); 
    const data = habitData[key];
    if(data) {
        $('info-title').innerText = data.title;
        $('info-desc').innerHTML = data.desc;
        $('info-modal').classList.remove('hidden');
    }
}

function closeInfo() {
    $('info-modal').classList.add('hidden');
}

// --- التحليل الذكي ---
function calcAnalysis() {
    const { weight, height, gender, goal } = state.profile;
    const heightInMeters = height / 100;
    const idealBMI = 22; 
    const idealWeight = Math.round(idealBMI * (heightInMeters * heightInMeters));
    
    $('ana-ideal-weight').innerText = `${idealWeight} كغ`;

    // حساب نسبة الدهون المثالية التقريبية
    const idealFat = gender === 'male' ? "10% - 14%" : "18% - 22%";
    $('ana-bodyfat-ideal').innerText = idealFat;

    const diff = Math.abs(weight - idealWeight); 
    const caloriesToBurn = diff * 7700; 
    const dailyPace = Math.abs(parseInt(goal));
    
    let timeMsg = "";
    let adviceMsg = "";

    const poorSleep = state.current.sleep > 0 && state.current.sleep < 7; 

    if (weight === idealWeight) {
        timeMsg = "أنت في الوزن المثالي!";
        adviceMsg = "حافظ على أدائك الحالي.";
    } else if (dailyPace === 0) {
        timeMsg = "غير محدد";
        adviceMsg = "أنت في وضع المحافظة.";
    } else {
        const needsToLose = weight > idealWeight;
        const isCutting = parseInt(goal) < 0;
        
        if (needsToLose && !isCutting) {
            timeMsg = "استراتيجية خاطئة!";
            adviceMsg = "يجب عليك التنشيف للوصول للمثالي.";
        } else if (!needsToLose && isCutting) {
            timeMsg = "استراتيجية خاطئة!";
            adviceMsg = "يجب عليك التضخيم للوصول للمثالي.";
        } else {
            const days = Math.ceil(caloriesToBurn / dailyPace);
            const weeks = (days / 7).toFixed(1);
            timeMsg = `${weeks} أسبوع`;
            
            if (isCutting) {
                adviceMsg = "أي تخريب سيوقف حرق الدهون لأيام.";
                if(poorSleep) adviceMsg = "تحذير: قلة نومك ستبطئ النزول وتزيد الجوع!";
            } else { 
                adviceMsg = "الالتزام يحول الوزن لعضل وليس دهون.";
                if(poorSleep) adviceMsg = "تحذير: العضلات تنمو أثناء النوم. قلة النوم = بناء عضلي ضعيف.";
            }
        }
    }
    $('ana-time').innerText = timeMsg;
    $('ana-advice').innerText = adviceMsg;
    $('ana-advice').style.color = poorSleep ? 'var(--danger)' : '#eee';
    
    calcBodyBattery(); // تحديث البطارية
}

// ميزة جديدة: حساب بطارية الجسم
function calcBodyBattery() {
    let battery = 100;
    const { sleep, water, calories, sleepDebt } = state.current;
    const { calories: targetCals, water: targetWater } = state.targets;

    // خصم للنوم (وخصم إضافي للديون المتراكمة)
    if (sleep > 0) {
        if (sleep < 5) battery -= 40;
        else if (sleep < 7) battery -= 20;
    }
    // خصم ديون النوم المتراكمة
    if(sleepDebt > 2) battery -= (sleepDebt * 5); // كل ساعة دين تخصم 5%

    // خصم للماء (إذا مر نصف اليوم ولم يشرب)
    const hour = new Date().getHours();
    if (hour > 12 && water < targetWater * 0.3) battery -= 10;

    // خصم للسعرات (وقود منخفض)
    if (hour > 14 && calories < targetCals * 0.3) battery -= 15;

    // خصم لعدم الراحة
    if (state.streak > 6 && (state.streak % 7 !== 0)) battery -= 10;

    // تحديد اللون والنص
    battery = Math.max(0, Math.min(100, battery));
    const bar = $('battery-bar-fill');
    const text = $('battery-percent');
    const advice = $('battery-advice');

    text.innerText = `${Math.round(battery)}%`;
    bar.style.width = `${battery}%`;

    if (battery >= 80) {
        bar.style.background = "var(--success)";
        advice.innerText = "جاهزية عالية! دمر الحديد اليوم 💪";
    } else if (battery >= 50) {
        bar.style.background = "var(--gold)";
        advice.innerText = "طاقة متوسطة. حافظ على أدائك.";
    } else {
        bar.style.background = "var(--danger)";
        advice.innerText = "طاقة منخفضة. ركز على النوم والاستشفاء اليوم.";
    }
}

// ميزة جديدة: حساب مؤقت البروتين
function calcProteinTimer() {
    const now = new Date();
    // إضافة 3.5 ساعة
    now.setMinutes(now.getMinutes() + 210); 
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const displayMin = minutes < 10 ? '0'+minutes : minutes;

    $('next-protein-time').innerText = `${displayHour}:${displayMin} ${ampm}`;

    // حساب الكمية المقترحة
    const remaining = state.targets.protein - state.current.protein;
    let suggestAmount = 30;
    if (remaining > 0) {
        // تقسيم المتبقي على عدد الوجبات المتبقية
        const currentHour = new Date().getHours();
        const hoursAwakeLeft = Math.max(1, 23 - currentHour); 
        const mealsLeft = Math.ceil(hoursAwakeLeft / 4);
        suggestAmount = Math.round(remaining / Math.max(1, mealsLeft));
    }
    $('next-protein-amount').innerText = `${suggestAmount}g`;
}

// --- التنقل ---
function navTo(screenId) {
    state.screen = screenId;
    show(screenId); // دالة إظهار الشاشة
    
    if(screenId === 'screen-dashboard') {
        checkDateAndReset(); 
        updateUI();
        calcCaffeineLimit(); 
        calcProteinTimer();

        // --- كود التشغيل التلقائي للجولة ---
        // ننتظر نصف ثانية حتى يتم رسم الشاشة بالكامل
        setTimeout(() => {
            // الشرط: إذا لم يرَ الجولة من قبل + الاسم موجود (يعني سجل دخول)
            if (!state.profile.tourSeen && state.profile.name) {
                TourManager.start();
            }
        }, 500);
    }
}

function openSettings() {
    $('edit-weight').value = state.profile.weight;
    $('edit-height').value = state.profile.height;
    $('edit-goal').value = state.profile.goal;
    navTo('screen-settings');
}

function resetAppData() {
    if(confirm('هل أنت متأكد من مسح بياناتك والبدء من جديد؟')) {
        localStorage.removeItem('bioState');
        location.reload();
    }
}

// دالة التحقق من التاريخ
function checkDateAndReset() {
    const today = new Date().toDateString();
    
    if (state.lastDate && state.lastDate !== today) {
        const remaining = state.targets.calories - state.current.calories;
        if (remaining > 0 && state.profile.goal <= 0) {
            state.bank += remaining;
            toast(`صباح الخير! تم إضافة ${remaining} cal للخزنة.`);
        }
        
        if ((state.streak + 1) % 7 === 0) {
            $('weight-modal').classList.remove('hidden');
        }

        // حفظ "دين النوم" قبل التصفير
        const targetSleep = 8;
        const actualSleep = state.current.sleep;
        if(actualSleep > 0) {
            const debt = targetSleep - actualSleep;
            // إذا كان الدين موجب (قلة نوم) يضاف، إذا سالب (نام كتير) يطرح من الدين السابق
            if(!state.current.sleepDebt) state.current.sleepDebt = 0;
            state.current.sleepDebt += debt;
            // لا نسمح للدين بأن يكون أقل من صفر (فائض نوم لا يخزن للأبد)
            if(state.current.sleepDebt < 0) state.current.sleepDebt = 0;
        }

        // تصفير اليوميات وإعادة ضبط العادات
        state.current.calories = 0;
        state.current.protein = 0;
        state.current.carbs = 0;
        state.current.fats = 0;
        state.current.water = 0;
        state.current.sleep = 0;
        state.current.steps = 0;
        state.current.habits = {salad:false, sun:false, walk:false, supplements:false, veggies:false, fruits:false};

        state.streak++;
        state.lastDate = today;
        saveState();
    } else if (!state.lastDate) {
        state.lastDate = today;
        saveState();
    }
}

function submitWeeklyWeight() {
    const newWeight = Number($('weekly-weight-input').value);
    if (!isValidPos(newWeight) || newWeight < 30) return toast("الرجاء إدخال وزن صحيح");

    const oldWeight = state.profile.weight;
    const diff = newWeight - oldWeight;
    const goal = state.profile.goal;
    const expectedChange = (goal * 7) / 7700; 
    
    let msg = "";
    if (goal < 0) { 
        if (diff <= expectedChange) msg = `ممتاز! نزلت ${Math.abs(diff.toFixed(1))} كغ. أنت تسحق الدهون! 🔥`;
        else if (diff < 0) msg = `جيد! نزلت ${Math.abs(diff.toFixed(1))} كغ. استمر.`;
        else msg = `تنبيه: الوزن زاد أو ثبت. راجع التزامك بالسعرات والنوم!`;
    } else if (goal > 0) {
        if (diff >= 0 && diff <= 0.5) msg = `مثالي! زيادة ${diff.toFixed(1)} كغ. عضل صافي بإذن الله 💪`;
        else msg = `زيادة سريعة جداً. انتبه من الدهون.`;
    } else {
        if (Math.abs(diff) < 0.5) msg = "ممتاز، وزنك ثابت.";
        else msg = "وزنك تغير رغم أن هدفك الثبات.";
    }

    $('weight-analysis-result').innerText = msg;
    state.profile.weight = newWeight;
    calcTargets(); 
    saveState();
    setTimeout(() => {
        $('weight-modal').classList.add('hidden');
        updateUI();
    }, 4000);
}

// --- الحسابات ---
function calcTargets() {
    const { weight, height, age, gender, goal } = state.profile;
    let bmr = 10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161);
    const tdee = bmr * 1.2; 
    const targetCals = Math.round(tdee + parseInt(goal));
    const protein = Math.round(weight * 2); 
    const fats = Math.round(weight * 0.9);
    const carbs = Math.round((targetCals - (protein * 4 + fats * 9)) / 4); 
    const water = (weight * 0.035).toFixed(1);

    state.targets = { calories: targetCals, protein, carbs, fats, water: parseFloat(water) };
    saveState();
}

function calcCaffeineLimit() {
    let targetSleepHour = 23; 
    const wakeVal = $('wake-time').value;
    
    if(wakeVal) {
        const [h, m] = wakeVal.split(':').map(Number);
        
        // 1. حساب وقت التوقف
        let sleepDate = new Date();
        sleepDate.setHours(h - 8, m, 0); // نفترض ينام قبل 8 ساعات من الاستيقاظ
        targetSleepHour = sleepDate.getHours();

        // 2. نافذة التركيز (بعد 90 دقيقة من الاستيقاظ)
        let focusStart = new Date();
        focusStart.setHours(h, m + 90, 0);
        let focusEnd = new Date();
        focusEnd.setHours(h + 3, m, 0); // نافذة لمدة ساعتين مثلاً
        
        const fStartStr = focusStart.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        $('caffeine-focus-window').innerText = `ابدأ ${fStartStr}`;
    }

    let caffeineLimitHour = targetSleepHour - 10;
    if(caffeineLimitHour < 0) caffeineLimitHour += 24;
    
    const ampm = caffeineLimitHour >= 12 ? 'PM' : 'AM';
    const displayHour = caffeineLimitHour % 12 || 12;
    
    $('caffeine-limit-time').innerText = `${displayHour}:00 ${ampm}`;
}

function calcSleepCycles() {
    const wakeTimeInput = $('wake-time').value;
    if(!wakeTimeInput) return toast("أدخل وقت الاستيقاظ أولاً!");
    
    const [hours, minutes] = wakeTimeInput.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0);

    const cycle90 = 90 * 60000;
    const fallAsleep = 15 * 60000;
    const time5cycles = new Date(wakeDate.getTime() - (5 * cycle90) - fallAsleep);
    const time6cycles = new Date(wakeDate.getTime() - (6 * cycle90) - fallAsleep);

    const fmt = (d) => d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    $('sleep-cycle-res').innerHTML = `
        لتصحو بنشاط، نام الساعة:<br>
        <span style="color:var(--primary); font-weight:bold; font-size:1.1rem;">${fmt(time6cycles)}</span> (أفضل شي) <br> أو <br>
        <span style="color:var(--gold); font-weight:bold; font-size:1.1rem;">${fmt(time5cycles)}</span> (جيد)
    `;
    calcCaffeineLimit(); 
}

function toggleHabit(habitKey) {
    if(!state.current.habits) state.current.habits = {};
    
    if(state.current.habits[habitKey]) {
        toast("🚫 تم إنجاز هذه العادة اليوم! لا يمكن التراجع.");
        return;
    }

    state.current.habits[habitKey] = true;
    toast("🎉 وحش! خطوة ممتازة نحو هدفك.");
    
    saveState();
    updateUI();
}

// --- الوظائف الأساسية ---
function addMeal() {
    const cals = Number($('meal-cals').value);
    const prot = Number($('meal-protein').value);
    const carbs = Number($('meal-carbs').value);
    const fat = Number($('meal-fats').value);
    const wat = Number($('meal-water').value);

    if (!isValidPos(cals) || !isValidPos(prot) || !isValidPos(carbs) || !isValidPos(fat) || !isValidPos(wat)) return;
    if (cals === 0 && prot === 0 && carbs === 0 && fat === 0 && wat === 0) return toast('أدخل بيانات الوجبة');

    let finalCals = cals;
    if (cals === 0) finalCals = (prot * 4) + (carbs * 4) + (fat * 9);

    state.current.calories += finalCals;
    state.current.protein += prot;
    state.current.carbs += carbs;
    state.current.fats += fat;
    state.current.water += wat;
    
    // منطق علمي: التأثير الحراري للبروتين
    if(prot > 30) toast('🔥 وجبة بروتين عالية! جسمك يستهلك سعرات الآن لهضمها (TEF).');
    
    const hour = new Date().getHours();
    if(hour > 21 && carbs > 40) toast('نصيحة: كارب عالي ليلاً قد يقلل حرق الدهون');
    else if(prot <= 30) toast('تم تسجيل الوجبة بنجاح');

    $('meal-cals').value = ''; $('meal-protein').value = ''; 
    $('meal-carbs').value = ''; $('meal-fats').value = '';
    $('meal-water').value = '';

    checkInsulin();
    calcBodyBattery(); 
    calcProteinTimer(); 
    saveState();
    updateUI();
}

function addSteps() {
    const steps = Number($('inp-steps').value);
    if (!isValidPos(steps)) return;
    if(steps > 0) {
        const calBurn = Math.round(steps * 0.04);
        state.current.calories -= calBurn; 
        state.targets.water += 0.2; 
        toast(`حرقت ${calBurn} cal (تم إضافتها للمتبقي)`);
        $('inp-steps').value = '';
        toggleAct('steps-panel');
        saveState();
        updateUI();
    }
}

function addSleep() {
    const hours = Number($('inp-sleep').value);
    if(!isValidPos(hours) || hours > 24) return toast('الرجاء إدخال عدد ساعات صحيح');
    state.current.sleep = hours;
    
    if(hours < 7) toast('تحذير: قلة النوم سترفع الكورتيزول وتعيق الحرق اليوم!');
    else toast('نوم ممتاز! الهرمونات تعمل لصالحك اليوم.');
    
    $('inp-sleep').value = '';
    toggleAct('sleep-panel');
    calcBodyBattery(); // تحديث البطارية
    saveState();
    updateUI();
}

function toggleCardioInputs() {
    const type = $('cardio-type').value;
    if (type === 'treadmill') $('inputs-treadmill').classList.remove('hidden');
    else $('inputs-treadmill').classList.add('hidden');
}

function addCardio() {
    const type = $('cardio-type').value;
    const duration = Number($('cardio-duration').value);
    const weight = state.profile.weight;
    let burned = 0;

    if (!isValidPos(duration) || duration === 0) return toast('الرجاء إدخال المدة');

    if (type === 'treadmill') {
        const speedKmh = Number($('tm-speed').value);
        const incline = Number($('tm-incline').value);
        if (speedKmh > 25) return toast('خطأ: سرعة التردميل غير منطقية');
        const speedMmin = speedKmh * 16.6667; 
        const grade = incline ? incline / 100 : 0;
        let vo2 = (0.1 * speedMmin) + (1.8 * speedMmin * grade) + 3.5;
        const calPerMin = (vo2 * weight) / 200; 
        burned = Math.round(calPerMin * duration);
    } else if (type === 'bike') {
        burned = Math.round((7.5 * 3.5 * weight / 200) * duration);
    } else if (type === 'stairs') {
        burned = Math.round((9.0 * 3.5 * weight / 200) * duration);
    } else if (type === 'run') {
        burned = Math.round((9.8 * 3.5 * weight / 200) * duration);
    } else if (type === 'swim') {
        burned = Math.round((8.0 * 3.5 * weight / 200) * duration);
    }

    state.current.calories -= burned; 
    
    // منطق علمي: زيادة هدف الماء بناءً على التعرق المتوقع
    // نفترض فقدان 500مل لكل 30 دقيقة نشاط متوسط/عالي
    const extraWater = (duration / 30) * 0.5; 
    state.targets.water += extraWater; 

    toast(`🔥 حرقت ${burned} cal وزدنا هدف الماء ${extraWater.toFixed(1)}L لتعويض العرق`);
    toggleAct('cardio-panel');
    
    $('cardio-duration').value = ''; $('tm-speed').value = ''; $('tm-incline').value = '';
    saveState();
    updateUI();
}

function addWeights() {
    const min = Number($('wt-min').value);
    const intensity = $('wt-intensity').value;
    const weight = state.profile.weight;
    
    if (!isValidPos(min) || min === 0) return toast('الرجاء إدخال الوقت');
    if (min > 90) toast('تنبيه: الكورتيزول (هرمون الهدم) يرتفع بشدة بعد 90 دقيقة!');

    let mets = 3.5; 
    if (intensity === 'moderate') mets = 5.0; 
    if (intensity === 'failure_rest') mets = 6.0; 
    if (intensity === 'failure_norest') mets = 8.0; 

    const burned = Math.round((mets * 3.5 * weight / 200) * min);
    state.current.calories -= burned;
    
    // منطق علمي: الماء
    const extraWater = (min / 30) * 0.3;
    state.targets.water += extraWater; 

    toast(`💪 وحش! حرقت ${burned} cal وزدنا هدف الماء`);
    toggleAct('weights-panel');
    $('wt-min').value = '';
    saveState();
    updateUI();
}

function checkInsulin() {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) $('insulin-warning').classList.remove('hidden');
    else $('insulin-warning').classList.add('hidden');
}

function updateRank() {
    const streak = state.streak;
    const el = $('user-rank');
    if(streak < 3) el.innerText = "مبتدئ";
    else if(streak < 10) el.innerText = "ملتزم 🔥";
    else if(streak < 30) el.innerText = "وحش 🦁";
    else el.innerText = "أسطورة 👑";
}

function updateUI() {
    const rem = state.targets.calories - state.current.calories;
    $('cals-remaining').innerText = rem;
    $('cals-target').innerText = state.targets.calories;
    
    calcAnalysis();
    updateRank();
    calcBodyBattery(); 

    if(!state.current.habits) state.current.habits = {};
    const habitKeys = ['salad', 'sun', 'walk', 'supplements', 'veggies', 'fruits'];
    
    habitKeys.forEach(h => {
        const elItem = $(`habit-${h}`);
        const elIcon = $(`icon-${h}`);
        if(elItem && elIcon) {
            if(state.current.habits[h]) {
                elItem.classList.add('done');
                elIcon.className = "fas fa-check-circle";
            } else {
                elItem.classList.remove('done');
                elIcon.className = "far fa-circle";
            }
        }
    });

    const percent = Math.min(100, Math.max(0, (state.current.calories / state.targets.calories) * 100));
    const circle = $('cals-circle');
    if(circle) {
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    updateBar('p', state.current.protein, state.targets.protein, 'g');
    updateBar('c', state.current.carbs, state.targets.carbs, 'g');
    updateBar('f', state.current.fats, state.targets.fats, 'g');

    // ميزة: تحذير احتباس الماء
    if(state.current.carbs > state.targets.carbs) {
        $('water-retention-msg').style.display = 'block';
    } else {
        $('water-retention-msg').style.display = 'none';
    }
    
    // منطق النوم البصري والديون
    const elSleepScore = $('sleep-score-val');
    const fillSleep = document.querySelector('.sleep-fill');
    const sleepHours = state.current.sleep;
    
    if(elSleepScore && fillSleep) {
        let score = 0;
        let color = "#333";
        if(sleepHours > 0) {
            score = Math.min(100, (sleepHours / 8) * 100);
            if(sleepHours < 5) color = "var(--danger)"; 
            else if(sleepHours < 7) color = "var(--gold)"; 
            else color = "var(--success)"; 
        }
        elSleepScore.innerText = `${score.toFixed(0)}%`;
        elSleepScore.style.color = color;
        fillSleep.style.width = `${score}%`;
        fillSleep.style.background = color;
    }

    // عرض دين النوم إذا وجد
    const elSleepDebt = $('sleep-debt-text');
    const elDebtWarning = $('sleep-debt-warning');
    if(!state.current.sleepDebt) state.current.sleepDebt = 0;
    
    if(state.current.sleepDebt > 0) {
        elSleepDebt.style.display = 'block';
        elSleepDebt.innerText = `Sleep Debt: -${state.current.sleepDebt.toFixed(1)}h`;
        
        if(state.current.sleepDebt > 5) elDebtWarning.classList.remove('hidden');
        else elDebtWarning.classList.add('hidden');
    } else {
        elSleepDebt.style.display = 'none';
        elDebtWarning.classList.add('hidden');
    }

    const elWater = $('macro-water');
    const fillWater = document.querySelector('.water-fill');
    if(elWater && fillWater) {
        const curW = state.current.water.toFixed(1);
        const tarW = state.targets.water.toFixed(1);
        elWater.innerText = `${curW} / ${tarW} L`;
        const pct = Math.min(100, (state.current.water / state.targets.water) * 100);
        fillWater.style.width = `${pct}%`;
    }

    if (state.profile.goal > 0) {
        $('weekly-bank-val').innerText = 'مغلق (تضخيم)';
        $('weekly-bank-val').style.color = '#777';
    } else {
        $('weekly-bank-val').innerText = state.bank + ' cal';
    }
    
    $('streak-days').innerText = state.streak;
    if(state.profile.name) $('dash-name').innerText = state.profile.name;
}

function updateBar(type, curr, max, unit) {
    const elText = $(`macro-${type}`);
    const elFill = document.querySelector(`.${type}-fill`);
    const elParent = elFill.parentElement; // الـ m-bar

    if(elText && elFill) {
        elText.innerText = `${curr} / ${max} ${unit}`;
        const pct = Math.min(100, Math.max(0, (curr / max) * 100));
        elFill.style.width = `${pct}%`;

        // ميزة بصرية: توهج عند الاكتمال
        if (pct >= 100) {
            elParent.classList.add('goal-reached-bar');
        } else {
            elParent.classList.remove('goal-reached-bar');
        }
    }
}

function toggleAct(id) {
    const el = $(id);
    if(el.classList.contains('hidden')) {
        document.querySelectorAll('.logic-panel').forEach(p => p.classList.add('hidden'));
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

function saveState() { localStorage.setItem('bioState', JSON.stringify(state)); }

function loadState() {
    const s = localStorage.getItem('bioState');
    if(s) {
        Object.assign(state, JSON.parse(s));
        if(!state.lastDate) state.lastDate = new Date().toDateString();
        if(!state.current.steps) state.current.steps = 0;
        if(!state.current.habits) state.current.habits = {salad:false, sun:false, walk:false, supplements:false, veggies:false, fruits:false};
        if(!state.current.sleepDebt) state.current.sleepDebt = 0; // تأكد من وجود المتغير

        if(state.profile.name && state.profile.name !== '') {
            navTo('screen-dashboard');
        } else {
            navTo('screen-setup');
        }
    } else {
        navTo('screen-setup');
    }
}

$('form-setup').onsubmit = (e) => {
    e.preventDefault();
    const name = $('set-name').value;
    const w = Number($('set-weight').value);
    const h = Number($('set-height').value);
    const a = Number($('set-age').value);
    
    if(!isValidPos(w) || !isValidPos(h) || !isValidPos(a)) return;

    state.profile.name = name;
    state.profile.weight = w;
    state.profile.height = h;
    state.profile.age = a;
    state.profile.gender = $('set-gender').value;
    state.profile.goal = Number($('set-goal').value);
    state.lastDate = new Date().toDateString(); 
    
    calcTargets();
    navTo('screen-dashboard');
};

$('form-edit').onsubmit = (e) => {
    e.preventDefault();
    const w = Number($('edit-weight').value);
    const h = Number($('edit-height').value);
    if(w > 0) state.profile.weight = w;
    if(h > 0) state.profile.height = h;
    state.profile.goal = Number($('edit-goal').value);
    calcTargets();
    toast('تم تحديث البيانات بنجاح');
    navTo('screen-dashboard');
};

loadState();