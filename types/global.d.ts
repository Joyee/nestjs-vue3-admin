/**
 * NestedKeyOf: 接受一个泛型ObjectType作为输入，并返回一个字符串类型
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedKeyOf<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 * 首先，使用索引类型 keyof ObjectType & (string | number) 来获取ObjectType对象中所有的字符串和数字类型的键,
 * 然后，对于每个键，它使用条件类型进行递归判断，如果该键对应的值是一个对象，则继续递归获取该值中的嵌套键;
 * 如果该键对应的值不是一个对象，则直接返回该键,
 * 最后，使用模板字符串将所有的键连接起来，形成一个嵌套键的字符串表示
 */
declare type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// const obj = {
//   foo: {
//     bar: {
//       baz: 'hello',
//     },
//   },
//   qux: 42,
// };
// NestedKeyOf<typeof obj> 的输出结果将为：
// 'foo' | 'foo.bar' | 'foo.bar.baz' | 'qux'