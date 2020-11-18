import React from 'react';
import flag from 'country-code-emoji';

const safeFlag = countryCode => {
  try {
    return flag(countryCode.substr(0, 2))
  } catch (e) {
    console.warn(e)
    return countryCode
  }
}
// https://stackoverflow.com/a/59793087/2987090
const emojiStrToUnicode = emoji => String.fromCodePoint("0x"+ emoji.codePointAt(0).toString(16));

export default function LaunchListItem({ store, value }) {
  const { 
    name,
    thumbnailURL,
    countryCode,
    startDate,
    success,
  } = value
  const { checkFavorite, toggleFavorite } = store
  const successEmoji = success 
    ? emojiStrToUnicode('🟢') 
    : emojiStrToUnicode('🔴')
  const nameElement = value.showUrl() 
    ? <a href={value.showUrl()} target="_blank"  rel="noopener noreferrer">{name}</a>
    : name

  return <article className="launch-list-item">
    <h1>
      {safeFlag(countryCode)}
      &nbsp;
      {successEmoji}
      &nbsp;
      {nameElement}
      {checkFavorite(value) && emojiStrToUnicode('⭐')}
    </h1>
    {
      thumbnailURL 
      &&
      <img className="launch-list-item-thumbnail" alt="thumbnail" src={thumbnailURL} />
    }
    <span>Start Date: {startDate.toLocaleString()}</span>
    <br />
    <button onClick={() => toggleFavorite(value)}>
      {checkFavorite(value) ? 'Remove from' : 'Add to'} {emojiStrToUnicode('⭐')}
    </button>
  </article>
}
