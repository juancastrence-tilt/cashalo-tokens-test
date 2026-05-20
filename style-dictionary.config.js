import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

// Register Tokens Studio's transforms so Style Dictionary understands
// the W3C-style $type/$value format and Token Studio's references.
register(StyleDictionary);

const sd = new StyleDictionary({
  source: ['tokens-studio.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    ios: {
      transformGroup: 'tokens-studio',
      transforms: ['name/camel'],
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
      transformGroup: 'tokens-studio',
      transforms: ['name/snake'],
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
