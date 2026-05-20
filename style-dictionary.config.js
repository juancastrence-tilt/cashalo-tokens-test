import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

// Register Tokens Studio's transforms + preprocessors so Style Dictionary
// understands W3C-style $type/$value format and resolves Token Studio references.
register(StyleDictionary);

const sd = new StyleDictionary({
  source: ['tokens-studio.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    ios: {
      transformGroup: 'ios-swift', // ← built-in: handles UIColor + CGFloat
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
      transformGroup: 'compose', // ← built-in: handles Color(0xFF...) + .dp
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
