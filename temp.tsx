
const MemoizedChapterView = React.memo(({
  chap,
  idx,
  isFirstRendered,
  currentChapterIndex,
  frameEnabled,
  frameStyles,
  frameBorder,
  activeParagraphSpacing,
  currentTheme,
  bookTitle,
  activeFontSize,
  activeLineHeight,
  activeFontFamily,
  isLandscape,
  highlightedParagraph,
  renderTransformedText
}: any) => {
  return (
    <article 
      id={`chap-article-${chap.id}`}
      data-chapter-index={idx}
      className={frameEnabled ? `chapter-article ${frameStyles.cardClass} mb-12 scroll-mt-20` : "chapter-article relative transition-all duration-300 mb-12 select-text scroll-mt-20"}
      aria-hidden={idx < currentChapterIndex ? "true" : undefined}
      style={{
        ...(frameEnabled ? frameStyles.cardStyle : {}),
        paddingBottom: `${activeParagraphSpacing}rem`
      }}
    >
      {frameEnabled && frameBorder === 'ornament' && (
        <div 
          className="absolute inset-3 pointer-events-none rounded-[inherit] border border-dashed opacity-40"
          style={{ borderColor: frameStyles.cardStyle?.borderColor || 'rgba(0,0,0,0.15)' }} 
        />
      )}

      {!isFirstRendered && (
        <div id={`hearts-separator-${idx}`} className="text-center py-12 select-none relative">
          <hr className="w-1/3 mx-auto opacity-10 mb-8" style={{ borderColor: frameEnabled ? (frameStyles.cardStyle?.color || currentTheme.text) : currentTheme.text }} />
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-2" style={{ letterSpacing: '0.05em' }}>
            {bookTitle}
          </h2>
          <hr className="w-1/12 mx-auto opacity-20 mt-4" style={{ borderColor: currentTheme.accent }} />
        </div>
      )}

      {isFirstRendered && (
        <div id="first-chapter-header" className="text-center pb-8 select-none">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-tight">{bookTitle}</h1>
          <hr className="w-1/12 mx-auto opacity-20 mb-8" style={{ borderColor: currentTheme.accent }} />
        </div>
      )}

      <div className="mb-10 text-left">
        <h3 
          className="font-serif font-semibold tracking-tight leading-snug select-text opacity-90 border-b pb-2" 
          style={{ 
            fontSize: `${activeFontSize * 1.15}px`,
            borderColor: frameEnabled ? (frameStyles.cardStyle?.borderColor || currentTheme.border) : currentTheme.border
          }}
        >
          {renderTransformedText(chap.title)}
        </h3>
      </div>

      <div 
        className="select-text transition-all duration-300 columns-1" 
        style={{ 
          fontFamily: activeFontFamily,
          textAlign: isLandscape ? 'justify' : 'left'
        }}
      >
        {chap.content.map((para: string, pIdx: number) => {
          const isHighlighted = highlightedParagraph?.chapterId === chap.id && highlightedParagraph?.paragraphIndex === pIdx;
          return (
            <p 
              id={`chap-${chap.id}-p-${pIdx}`}
              key={pIdx} 
              className={`leading-relaxed rounded px-2 py-1 transition-all duration-1000 ${
                isHighlighted 
                  ? 'bg-[#FF79B0]/25 dark:bg-[#FF79B0]/35 ring-2 ring-[#FF79B0]/60 shadow-lg' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              style={{ 
                fontSize: `${activeFontSize}px`, 
                lineHeight: activeLineHeight,
                marginBottom: `${activeParagraphSpacing}rem`
              }}
            >
              {renderTransformedText(para)}
            </p>
          );
        })}
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  if (prevProps.chap !== nextProps.chap) return false;
  if (prevProps.idx !== nextProps.idx) return false;
  if (prevProps.isFirstRendered !== nextProps.isFirstRendered) return false;
  
  const prevHidden = prevProps.idx < prevProps.currentChapterIndex;
  const nextHidden = nextProps.idx < nextProps.currentChapterIndex;
  if (prevHidden !== nextHidden) return false;
  
  if (prevProps.frameEnabled !== nextProps.frameEnabled) return false;
  if (prevProps.frameBorder !== nextProps.frameBorder) return false;
