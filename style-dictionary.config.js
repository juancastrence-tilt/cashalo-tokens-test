import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

// Custom transform: output spacing/sizing as raw CGFloat (no rem conversion)
StyleDictionary.registerTransform({
  name: 'size/swift/raw-cgfloat',
  type: 'value',
  filter: (token) => ['spacing', 'sizing', 'dimension', 'borderRadius'].includes(token.$type || token.type),
  transform: (token) => `CGFloat(${parseFloat(token.$value || token.value)})`,
});

// Custom transform: output spacing/sizing as Compose Dp value
StyleDictionary.registerTransform({
  name: 'size/compose/raw-dp',
  type: 'value',
  filter: (token) => ['spacing', 'sizing', 'dimension', 'borderRadius'].includes(token.$type || token.type),
  transform: (token) => `${parseFloat(token.$value || token.value)}.dp`,
});

const sd = new StyleDictionary({
  source: ['tokens-studio.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    ios: {
      transforms: [
        'attribute/cti',
        'name/camel',
        'color/UIColorSwift',
        'size/swift/raw-cgfloat',
        'content/swift/literal',
      ],
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'Tokens.swift',
          format: 'ios-swift/class.swift',
          options: {
            className: 'CashaloTokens',
            accessLevel: 'public',
          },
        },
      ],
    },
    android: {
      transforms: [
        'attribute/cti',
        'name/snake',
        'color/composeColor',
        'size/compose/raw-dp',
      ],
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'Tokens.kt',
          format: 'compose/object',
          options: {
            className: 'CashaloTokens',
            packageName: 'com.cashalo.designtokens',
          },
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();

console.log('\n✅ Design tokens generated successfully.');
