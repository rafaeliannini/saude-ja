import React, { useEffect, useMemo, useState } from 'react'
import plan from '../plano_alimentar_calorias_macros_e_opcoes.json'
import { mealIdForHour } from './mealSchedule.js'

const photos = {
  breakfast: '/images/breakfast.jpg',
  oats: '/images/oats.jpg',
  lunch: '/images/lunch.jpg',
  yogurt: '/images/yogurt.jpg',
  wrap: '/images/wrap.jpg',
  beef: '/images/beef.jpg',
  fish: '/images/fish.jpg',
  papaya: '/images/papaya.jpg',
  sandwich: '/images/sandwich.jpg',
  banana: '/images/banana.jpg',
  appleOats: '/images/apple-oats.jpg',
  omeletteBread: '/images/omelette-bread.jpg',
  chickenBowl: '/images/chicken-bowl.jpg',
  omeletteRice: '/images/omelette-rice.jpg',
  strawberryShake: '/images/strawberry-shake.jpg',
  cuscuz: '/images/cuscuz.jpg',
  tapiocaTuna: '/images/tapioca-tuna.jpg',
  tapiocaChicken: '/images/tapioca-chicken.jpg',
}

const meals = [
  { id: 'cafe', source: 'café da manhã', title: 'Café da manhã', short: 'Comece bem o dia', time: '05:00 – 08:59', icon: '☀', tint: '#e9f6fb' },
  { id: 'manha', source: 'antes do exercício ou lanche da manhã', title: 'Lanche da manhã', short: 'Uma pausa leve', time: '09:00 – 10:59', icon: '◌', tint: '#f2f8e9' },
  { id: 'almoco', source: 'almoço', title: 'Almoço', short: 'Energia para continuar', time: '11:00 – 14:59', icon: '✳', tint: '#eef5fb' },
  { id: 'tarde', source: 'lanche da tarde', title: 'Lanche da tarde', short: 'Recarregue as energias', time: '15:00 – 17:59', icon: '✺', tint: '#f6f0fa' },
  { id: 'jantar', source: 'jantar', title: 'Jantar', short: 'Feche o dia com equilíbrio', time: '18:00 – 04:59', icon: '☾', tint: '#edf3fb' },
]

const options = plan.opcoes_por_refeicao.map((dish, index) => ({ ...dish, id: index }))
const referenceCalories = Object.fromEntries(plan.estimativas_plano_por_refeicao.slice(0, 5).map(item => [item.refeicao, item.calorias_kcal]))
const goal = plan.estimativas_plano_por_refeicao.find(item => item.refeicao.startsWith('total diário')).calorias_kcal
const number = new Intl.NumberFormat('pt-BR')

const generatedDishPhotos = {
  'Ovos mexidos, pão francês e café com leite': '/images/scrambled-eggs-bread.jpg',
  'Torradas francesas salgadas com ovos e queijo': '/images/savory-french-toast.jpg',
  'Mamão com aveia': '/images/papaya-oats.jpg',
  'Vitamina leve de banana e aveia': '/images/banana-oat-smoothie.jpg',
  'Pera com farelo de aveia': '/images/pear-oat-bran.jpg',
  'Frango grelhado com batata, lentilha e legumes': '/images/chicken-potato-lentil.jpg',
  'Patinho grelhado com arroz, feijão e salada': '/images/beef-rice-beans.jpg',
  'Peixe assado com arroz e grão-de-bico': '/images/baked-fish-rice-chickpeas.jpg',
  'Omelete de três ovos com arroz, feijão e salada': '/images/three-egg-omelette-rice-beans.jpg',
  'Iogurte com banana, chia e whey': '/images/yogurt-banana-chia-whey.jpg',
  'Iogurte com uvas, whey e semente de abóbora': '/images/yogurt-grapes-pumpkin-seeds.jpg',
  'Creme de mamão com whey e castanha-do-pará': '/images/papaya-cream-brazil-nut.jpg',
  'Melão com iogurte, whey e sementes de girassol': '/images/melon-yogurt-sunflower.jpg',
  'Pão de forma com omelete de atum': '/images/tuna-omelette-sandwich.jpg',
  'Wrap de ovos com requeijão e salada': '/images/egg-wrap-cream-cheese-salad.jpg',
}

function photoFor(dish) {
  if (generatedDishPhotos[dish.prato]) return generatedDishPhotos[dish.prato]
  const name = dish.prato.toLowerCase()
  if (name.includes('maçã com aveia')) return photos.appleOats
  if (name.includes('omelete de frango')) return photos.omeletteBread
  if (name.includes('bowl de frango')) return photos.chickenBowl
  if (name.includes('omelete de três ovos')) return photos.omeletteRice
  if (name.includes('shake de morango')) return photos.strawberryShake
  if (name.includes('cuscuz com ovos')) return photos.cuscuz
  if (name.includes('tapioca com atum')) return photos.tapiocaTuna
  if (name.includes('tapioca de frango')) return photos.tapiocaChicken
  if (name.includes('mamão')) return photos.papaya
  if (name.includes('banana') && dish.refeicao.includes('manhã')) return photos.oats
  if (name.includes('iogurte') || name.includes('shake') || name.includes('melão')) return photos.yogurt
  if (name.includes('peixe')) return photos.fish
  if (name.includes('patinho')) return photos.beef
  if (name.includes('sanduíche') || name.includes('pão de forma')) return photos.sandwich
  if (name.includes('wrap') || name.includes('tapioca') || name.includes('cuscuz')) return photos.wrap
  if (dish.refeicao === 'almoço') return photos.lunch
  if (dish.refeicao.includes('lanche da manhã')) return photos.banana
  if (dish.refeicao === 'jantar') return photos.wrap
  return photos.breakfast
}

function pickFeaturedDishes() {
  return Object.fromEntries(meals.map(meal => {
    const dishes = options.filter(dish => dish.refeicao === meal.source)
    return [meal.id, dishes[Math.floor(Math.random() * dishes.length)]]
  }))
}

function todayKey() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function loadSelections() {
  try {
    return JSON.parse(localStorage.getItem(`saude-ja:${todayKey()}`)) || {}
  } catch {
    return {}
  }
}

function readRoute() {
  const [, type, mealId, dishId] = window.location.hash.split('/')
  const meal = meals.find(item => item.id === mealId)
  if (type === 'prato' && meal && options.some(item => item.id === Number(dishId) && item.refeicao === meal.source)) return { type, mealId, dishId: Number(dishId) }
  if (type === 'refeicao' && meal) return { type, mealId }
  if (type === 'diario') return { type }
  return { type: 'home' }
}

function go(path = '') {
  window.location.hash = path
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const shapes = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    plate: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /></>,
    chart: <><path d="M4 20V11" /><path d="M10 20V5" /><path d="M16 20v-8" /><path d="M22 20v-13" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    spark: <><path d="m12 2 1.9 7.1L21 11l-7.1 1.9L12 20l-1.9-7.1L3 11l7.1-1.9L12 2Z" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
  }
  return <svg {...common}>{shapes[name]}</svg>
}

function Macro({ label, value, color }) {
  return <span className="macro"><i style={{ background: color }} />{label} <strong>{value} g</strong></span>
}

function App() {
  const [route, setRoute] = useState(readRoute)
  const [selected, setSelected] = useState(loadSelections)
  const [featuredDishes] = useState(pickFeaturedDishes)
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours())
  useEffect(() => {
    const updateHour = () => setCurrentHour(new Date().getHours())
    let timer
    const scheduleNextMinute = () => {
      timer = window.setTimeout(() => {
        updateHour()
        scheduleNextMinute()
      }, 60_000 - (Date.now() % 60_000) + 10)
    }
    scheduleNextMinute()
    document.addEventListener('visibilitychange', updateHour)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', updateHour)
    }
  }, [])
  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => { localStorage.setItem(`saude-ja:${todayKey()}`, JSON.stringify(selected)) }, [selected])

  const chosen = useMemo(() => Object.values(selected).map(id => options.find(item => item.id === id)).filter(Boolean), [selected])
  const totals = chosen.reduce((sum, dish) => ({
    kcal: sum.kcal + dish.calorias_kcal,
    protein: sum.protein + dish.macros_g.proteina,
    carbs: sum.carbs + dish.macros_g.carboidratos,
    fat: sum.fat + dish.macros_g.gorduras,
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 })
  const currentMeal = meals.find(item => item.id === route.mealId)
  const currentDish = options.find(item => item.id === route.dishId)
  const featuredMeal = meals.find(meal => meal.id === mealIdForHour(currentHour))
  const heroDish = featuredDishes[featuredMeal.id]

  function choose(meal, dish) {
    setSelected(previous => ({ ...previous, [meal.id]: dish.id }))
  }
  function remove(meal) {
    setSelected(previous => { const next = { ...previous }; delete next[meal.id]; return next })
  }

  return <div className="site-shell">
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" onClick={() => go()} aria-label="Voltar para o início"><span className="brand-mark"><img src="/logo-saude-ja.png" alt="" /></span><span>saúde<span className="brand-plus">já</span><small>SEU PLANO, SEU RITMO</small></span></button>
        <nav className="main-nav" aria-label="Navegação principal">
          <button className={route.type === 'home' ? 'active' : ''} onClick={() => go()}>Início</button>
          <button className={route.type === 'diario' ? 'active' : ''} onClick={() => go('/diario')}>Meu dia</button>
        </nav>
        <button className="header-day" onClick={() => go('/diario')}><Icon name="chart" size={18} /><span>{number.format(totals.kcal)} / {number.format(goal)} kcal</span></button>
      </div>
    </header>

    <main className="container">
      {route.type === 'home' && <>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> PLANO ALIMENTAR DO DIA</span>
            <h1>Comer bem fica<br /><em>mais simples</em> por aqui.</h1>
            <p>Explore as opções do seu plano, escolha o que vai comer e acompanhe suas calorias ao longo do dia.</p>
            <button className="primary-button" onClick={() => document.getElementById('refeicoes')?.scrollIntoView({ behavior: 'smooth' })}>Explorar refeições <Icon name="arrow" size={18} /></button>
          </div>
          <div className="hero-visual"><img src={photoFor(heroDish)} alt={`Foto ilustrativa de ${heroDish.prato}`} /><div className="floating-card"><span className="floating-icon"><Icon name="plate" size={22} /></span><span><strong>{featuredMeal.title}</strong><small>Uma opção para este horário</small></span></div></div>
        </section>

        <section className="overview-grid" aria-label="Resumo do dia">
          <div className="daily-progress"><div className="summary-top"><div><span className="section-kicker">ACOMPANHAMENTO</span><h2>Seu dia, no seu ritmo</h2><p>{chosen.length === 0 ? 'Escolha um prato para começar a acompanhar.' : `${chosen.length} de 5 refeições selecionadas hoje.`}</p></div><span className="summary-icon"><Icon name="chart" size={23} /></span></div><div className="calorie-line"><strong>{number.format(totals.kcal)}</strong><span> / {number.format(goal)} kcal de referência</span></div><div className="progress-track"><span style={{ width: `${Math.min(100, totals.kcal / goal * 100)}%` }} /></div><button className="text-link" onClick={() => go('/diario')}>Ver meu dia <Icon name="arrow" size={17} /></button></div>
          <div className="guide-card"><span className="guide-badge"><Icon name="spark" size={20} /></span><h3>Pequenas escolhas,<br />grandes cuidados.</h3><p>Você tem 5 opções de pratos para cada refeição. Encontre a que combina com o seu dia.</p></div>
        </section>

        <section className="meal-section" id="refeicoes"><div className="section-heading"><div><span className="section-kicker">ESCOLHA SUA REFEIÇÃO</span><h2>O que vamos comer?</h2><p>Clique em uma refeição para descobrir as opções do plano.</p></div><span className="meal-count">05 REFEIÇÕES</span></div><div className="meal-grid">{meals.map((meal, index) => <button className="meal-card" key={meal.id} onClick={() => go(`/refeicao/${meal.id}`)}><div className="meal-photo" style={{ backgroundColor: meal.tint }}><img src={photoFor(featuredDishes[meal.id])} alt={`Foto ilustrativa de ${featuredDishes[meal.id].prato}`} loading="lazy" /><span className="meal-number">0{index + 1}</span></div><div className="meal-body"><div className="meal-meta"><Icon name="clock" size={15} /> {meal.time}</div><h3>{meal.title}</h3><p>{meal.short}</p><div className="meal-bottom"><span>≈ {referenceCalories[meal.source] || 435} kcal</span><span className="round-arrow"><Icon name="arrow" size={19} /></span></div></div></button>)}</div></section>
      </>}

      {route.type === 'refeicao' && currentMeal && <><button className="back-link" onClick={() => go()}><Icon name="back" size={18} /> Todas as refeições</button><section className="page-intro"><div><span className="section-kicker">SUAS OPÇÕES DE PRATO</span><h1>{currentMeal.title}<span className="title-period">.</span></h1><p>{currentMeal.source.includes('exercício') ? 'Opções leves para antes do exercício ou para o lanche da manhã.' : `Escolha uma das 5 opções para ${currentMeal.title.toLowerCase()}.`}</p></div><div className="intro-stat"><strong>05</strong><span>opções para escolher</span></div></section><div className="dish-grid">{options.filter(item => item.refeicao === currentMeal.source).map((dish, index) => <article className="dish-card" key={dish.id}><button className="dish-image-button" onClick={() => go(`/prato/${currentMeal.id}/${dish.id}`)} aria-label={`Ver ${dish.prato}`}><img src={photoFor(dish)} alt={`Foto ilustrativa de ${dish.prato}`} loading="lazy" /><span className="dish-index">OPÇÃO 0{index + 1}</span></button><div className="dish-info"><div className="dish-cal"><span className="cal-dot" /> {dish.calorias_kcal} kcal</div><h2>{dish.prato}</h2><div className="dish-macros"><Macro label="P" value={dish.macros_g.proteina} color="#6abfcb" /><Macro label="C" value={dish.macros_g.carboidratos} color="#eeb36e" /><Macro label="G" value={dish.macros_g.gorduras} color="#bd9ad9" /></div><div className="dish-actions"><button className="outline-button" onClick={() => go(`/prato/${currentMeal.id}/${dish.id}`)}>Ver receita <Icon name="arrow" size={17} /></button><button className={`select-button ${selected[currentMeal.id] === dish.id ? 'selected' : ''}`} onClick={() => choose(currentMeal, dish)} aria-label={selected[currentMeal.id] === dish.id ? 'Prato selecionado' : `Selecionar ${dish.prato}`}><Icon name={selected[currentMeal.id] === dish.id ? 'check' : 'plus'} size={19} /></button></div></div></article>)}</div></>}

      {route.type === 'prato' && currentMeal && currentDish && <><button className="back-link" onClick={() => go(`/refeicao/${currentMeal.id}`)}><Icon name="back" size={18} /> Voltar para {currentMeal.title.toLowerCase()}</button><div className="detail-layout"><div className="detail-photo"><img src={photoFor(currentDish)} alt={`Foto ilustrativa de ${currentDish.prato}`} /></div><div className="detail-content"><span className="section-kicker">{currentMeal.title.toUpperCase()} · OPÇÃO {options.filter(item => item.refeicao === currentMeal.source).findIndex(item => item.id === currentDish.id) + 1}</span><h1>{currentDish.prato}<span className="title-period">.</span></h1><p className="detail-lead">Uma opção do seu plano alimentar, com porções e preparo para facilitar sua rotina.</p><div className="nutrition-card"><div className="nutrition-main"><strong>{currentDish.calorias_kcal}</strong><span>kcal <small>por porção estimada</small></span></div><div className="nutrition-macros"><div><span>Proteínas</span><strong>{currentDish.macros_g.proteina} g</strong></div><div><span>Carboidratos</span><strong>{currentDish.macros_g.carboidratos} g</strong></div><div><span>Gorduras</span><strong>{currentDish.macros_g.gorduras} g</strong></div></div></div><button className={`primary-button detail-choose ${selected[currentMeal.id] === currentDish.id ? 'is-chosen' : ''}`} onClick={() => choose(currentMeal, currentDish)}><Icon name={selected[currentMeal.id] === currentDish.id ? 'check' : 'plus'} size={20} /> {selected[currentMeal.id] === currentDish.id ? 'Selecionado para hoje' : 'Adicionar ao meu dia'}</button></div></div><div className="recipe-grid"><section className="recipe-panel"><div className="panel-title"><span>01</span><h2>Ingredientes</h2></div><p>Para uma porção</p><ul className="ingredient-list">{Object.entries(currentDish.ingredientes).map(([name, amount]) => <li key={name}><span>{name}</span><strong>{amount}</strong></li>)}</ul></section><section className="recipe-panel"><div className="panel-title"><span>02</span><h2>Modo de preparo</h2></div><p>Simples e prático</p><ol className="preparation-list">{currentDish.preparo.map((step, index) => <li className="preparation" key={index}><span>{index + 1}</span><p>{step}</p></li>)}</ol><div className="recipe-note"><Icon name="spark" size={20} /><span>As calorias e os macros são estimativas do plano e podem variar conforme marcas e preparo.</span></div></section></div></>}

      {route.type === 'diario' && <><button className="back-link" onClick={() => go()}><Icon name="back" size={18} /> Voltar ao início</button><section className="page-intro"><div><span className="section-kicker">ACOMPANHAMENTO DIÁRIO</span><h1>Meu dia<span className="title-period">.</span></h1><p>Suas escolhas de hoje ficam salvas neste navegador.</p></div><div className="date-pill">{new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(new Date())}</div></section><div className="diary-layout"><section className="diary-summary"><span className="section-kicker">CALORIAS DE HOJE</span><div className="diary-total"><strong>{number.format(totals.kcal)}</strong><span> / {number.format(goal)} kcal</span></div><div className="progress-track"><span style={{ width: `${Math.min(100, totals.kcal / goal * 100)}%` }} /></div><p>{chosen.length} de 5 refeições selecionadas</p><div className="diary-macros"><div><span>Proteínas</span><strong>{totals.protein} g</strong></div><div><span>Carboidratos</span><strong>{totals.carbs} g</strong></div><div><span>Gorduras</span><strong>{totals.fat} g</strong></div></div><small>Referência aproximada do plano. As substituições alteram os totais.</small></section><section className="diary-list"><h2>Refeições do dia</h2>{meals.map(meal => { const dish = options.find(item => item.id === selected[meal.id]); return <div className="diary-row" key={meal.id}><img src={dish ? photoFor(dish) : photoFor(featuredDishes[meal.id])} alt="" /><div><span>{meal.title}</span><h3>{dish ? dish.prato : 'Nenhum prato selecionado'}</h3><small>{dish ? `${dish.calorias_kcal} kcal` : 'Escolha uma opção do plano'}</small></div><div className="diary-row-actions">{dish && <button onClick={() => remove(meal)} aria-label={`Remover ${meal.title}`} title="Remover"><Icon name="trash" size={18} /></button>}<button onClick={() => go(`/refeicao/${meal.id}`)} aria-label={`Escolher ${meal.title}`} title="Escolher prato"><Icon name="arrow" size={18} /></button></div></div> })}</section></div></>}
    </main>
    <footer className="site-footer"><div className="container footer-inner"><span>saúde<span className="brand-plus">já</span></span><p>Um jeito mais leve de acompanhar seu plano alimentar.</p><small>Imagens ilustrativas: <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a> e imagens geradas · Valores nutricionais estimados do plano.</small></div></footer>
  </div>
}

export default App
