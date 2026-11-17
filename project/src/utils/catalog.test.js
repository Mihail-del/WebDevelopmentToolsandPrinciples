import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProducts, paginateProducts, parsePrice, readCatalogFilters, searchProducts, sortProducts, updateCatalogParams } from './catalog.js';

const products = [
  { id: 'one', name: 'Чашка «Київ»', city: 'Київ', category: 'mugs', price: 48000, featured: true },
  { id: 'two', name: 'Листівка «Львів»', city: 'Львів', category: 'postcards', price: 3500, featured: false },
  { id: 'three', name: 'Чашка «Львів»', city: 'Львів', category: 'mugs', price: 35000, featured: false },
];

test('prices accept comma decimals and reject invalid or unsafe values', () => {
  assert.equal(parsePrice('35,50'), 3550);
  assert.equal(parsePrice('0'), 0);
  assert.equal(parsePrice(''), null);
  for (const input of ['-1', '1e3', 'Infinity', '3.456', '9007199254740992']) assert.ok(Number.isNaN(parsePrice(input)));
});

test('city, category and inclusive price limits work together', () => {
  const state = readCatalogFilters(new URLSearchParams('city=Львів&category=mugs&min=350&max=350'), products);
  assert.deepEqual(filterProducts(products, state).map((item) => item.id), ['three']);
});

test('multiple selections use OR within a filter and AND between filters', () => {
  const state = readCatalogFilters(new URLSearchParams('city=Львів&city=Київ&category=mugs'), products);
  assert.deepEqual(filterProducts(products, state).map((item) => item.id), ['one', 'three']);
});

test('pasted invalid filters fall back safely and inverted prices are normalized', () => {
  const state = readCatalogFilters(new URLSearchParams('city=unknown&category=bad&min=500&max=30'), products);
  assert.deepEqual(state, { cities: [], categories: [], min: 3000, max: 50000 });
  assert.equal(readCatalogFilters(new URLSearchParams('min=oops&max=-2'), products).min, null);
});

test('search ignores Ukrainian letter case and extra spaces', () => {
  assert.deepEqual(searchProducts(products, '  ЧАШКА  ').map((item) => item.id), ['one', 'three']);
  assert.equal(searchProducts(products, 'немає').length, 0);
});

test('sorting preserves source data and works after search and filters', () => {
  const before = products.map((item) => item.id);
  assert.deepEqual(sortProducts(searchProducts(products, 'Чашка'), 'price-asc').map((item) => item.id), ['three', 'one']);
  assert.deepEqual(sortProducts(products, 'price-desc').map((item) => item.price), [48000, 35000, 3500]);
  const asc = sortProducts(products, 'name-asc');
  assert.deepEqual(sortProducts(products, 'name-desc'), [...asc].reverse());
  assert.deepEqual(products.map((item) => item.id), before);
});

test('changing filters preserves other parameters and resets page', () => {
  const previous = new URLSearchParams('q=чашка&sort=price-asc&page=3&city=Київ');
  const next = updateCatalogParams(previous, { city: ['Львів', 'Київ'], min: 50 });
  assert.equal(next.get('q'), 'чашка');
  assert.equal(next.get('sort'), 'price-asc');
  assert.equal(next.has('page'), false);
  assert.deepEqual(next.getAll('city'), ['Львів', 'Київ']);
  assert.equal(previous.get('page'), '3');
});

test('pagination limits each page to nine and clamps pasted page numbers', () => {
  const many = Array.from({ length: 30 }, (_, id) => ({ id }));
  assert.equal(paginateProducts(many, '1').items.length, 9);
  assert.deepEqual(paginateProducts(many, '4').items.map((item) => item.id), [27, 28, 29]);
  assert.equal(paginateProducts(many, '999').page, 4);
  for (const value of [null, '0', '-1', '2.5', 'oops', '1e2', '9007199254740992']) assert.equal(paginateProducts(many, value).page, 1);
  assert.deepEqual(paginateProducts([], '5'), { page: 1, pageCount: 1, items: [], start: 0 });
});

test('filter and sort happen before slicing a page', () => {
  const many = Array.from({ length: 30 }, (_, id) => ({ id, name: 'Чашка', city: id % 2 ? 'Київ' : 'Львів', category: 'mugs', price: id * 100, featured: false }));
  const filters = readCatalogFilters(new URLSearchParams('city=Київ'), many);
  const sorted = sortProducts(searchProducts(filterProducts(many, filters), 'чашка'), 'price-desc');
  assert.deepEqual(paginateProducts(sorted, '2').items.map((item) => item.id), [11, 9, 7, 5, 3, 1]);
});
