# Saúde Já

Frontend em React para explorar o plano alimentar, consultar ingredientes e preparo e acompanhar as calorias do dia.

## Executar

```bash
npm install
npm run dev
```

Abra o endereço local exibido pelo Vite. Para gerar a versão de produção, execute `npm run build`.

## Como funciona

- As 5 refeições e 25 pratos vêm de `plano_alimentar_calorias_macros_e_opcoes.json`.
- Selecione um prato por refeição. O resumo diário soma calorias e macronutrientes das escolhas.
- As escolhas são guardadas no `localStorage` deste navegador, separadas por data. Não há backend nem conta.
- Os valores nutricionais são estimativas do plano original. As imagens são ilustrativas e não representam necessariamente as quantidades ou todos os ingredientes de cada receita.
- A imagem de destaque acompanha o horário local: café da manhã (05:00–08:59), lanche da manhã (09:00–10:59), almoço (11:00–14:59), lanche da tarde (15:00–17:59) e jantar (18:00–04:59).
- A cada visita, uma foto de prato é sorteada para cada refeição na página inicial e em “Meu dia”. Após selecionar um prato, “Meu dia” mostra a foto específica dele.
- O campo `preparo` de cada prato no JSON contém uma lista ordenada de passos, exibida na página da receita.

## Fotos

Imagens disponíveis sob a [licença do Unsplash](https://unsplash.com/license):

- [Café da manhã](https://unsplash.com/photos/healthy-breakfast-with-toast-eggs-and-vegetables-2h9_d8JPIO0)
- [Aveia e banana](https://unsplash.com/photos/a-bowl-of-oatmeal-with-banana-slices-on-top-qzRVPgqSWn4)
- [Frango grelhado e arroz](https://unsplash.com/photos/a-white-plate-topped-with-meat-and-vegetables-4ByydxYLiZc)
- [Iogurte e frutas](https://unsplash.com/photos/a-bowl-of-yogurt-with-strawberries-and-granola-HOG77nPyA8Y)
- [Wrap](https://unsplash.com/photos/a-black-plate-topped-with-a-burrito-and-a-salad-MdkUEKFfkTM)
- [Carne, arroz e salada](https://unsplash.com/photos/steak-rice-and-salad-with-sauce-CLpVHdbj_bc)
- [Peixe e arroz](https://unsplash.com/photos/a-plate-of-food-with-fish-rice-and-salad-EO9gY-N3oUk)
- [Mamão](https://unsplash.com/photos/papaya-fruit-uvyO-QvkUyY)
- [Sanduíche](https://unsplash.com/photos/a-sandwich-on-a-plate-Uoif1I2hrAU)
- [Banana](https://unsplash.com/photos/yellow-banana-fruit-on-gray-table-VI2rIoZUrks)
- [Maçã e aveia](https://unsplash.com/photos/a-bowl-of-oatmeal-apple-slices-and-a-spoon-on-a-cYVFvldOq5k)
- [Omelete e pão](https://unsplash.com/photos/omelette-with-salad-and-toast-served-on-a-plate-TpdD-DDOF6Q)
- [Bowl de frango e arroz](https://unsplash.com/photos/a-bowl-of-rice-chickpeas-and-salad-with-meat-g7WrssBb1Ak)
- [Omelete, arroz e salada](https://unsplash.com/photos/delicious-meal-featuring-rice-salad-and-an-omelet-cmudGB8Hrp0)
- [Shake de morango](https://unsplash.com/photos/strawberry-shake-on-clear-drinking-glass-zpv8D8DOShs)

As imagens de cuscuz com ovos, tapioca de atum e tapioca de frango, além das 15 receitas adicionadas nesta etapa, foram geradas para representar os pratos do plano. São ilustrações fotográficas, não fotos dos pratos preparados. O mapeamento das imagens geradas está em `src/App.jsx` e os arquivos estão em `public/images/`.

