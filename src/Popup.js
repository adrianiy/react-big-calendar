/* eslint-disable no-console */

import React, { useLayoutEffect } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from './hooks/useClickOutside'
import EventCell from './EventCell'
import { isSelected } from './utils/selection'

function Pop({
  containerRef,
  accessors,
  getters,
  selected,
  components,
  localizer,
  position,
  show,
  events,
  slotStart,
  slotEnd,
  onSelect,
  onDoubleClick,
  onKeyPress,
  handleDragStart,
  popperRef,
  target,
  offset,
}) {
  useClickOutside({ ref: popperRef, callback: show })
  useLayoutEffect(() => {
    if (!popperRef.current || !containerRef.current || !target) return

    const targetRect = target.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const popperRect = popperRef.current.getBoundingClientRect()

    console.log('targetRect', targetRect)
    console.log('containerRect', containerRect)
    console.log('popperRect', popperRect)
    console.log('offset', offset)

    const topOffset =
      targetRect.bottom + offset.y > containerRect.bottom
        ? targetRect.top - popperRect.height - offset.y
        : targetRect.bottom + offset.y

    const leftOffset =
      targetRect.right + popperRect.width > containerRect.right
        ? targetRect.left - popperRect.width + targetRect.width
        : targetRect.left

    popperRef.current.style.top = `${topOffset}px`
    popperRef.current.style.left = `${leftOffset}px`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset.x, offset.y, target, containerRef, popperRef])

  const { width } = position
  const style = {
    minWidth: width + width / 2,
  }
  return (
    <div style={style} className="rbc-overlay" ref={popperRef}>
      <div className="rbc-overlay-header">
        {localizer.format(slotStart, 'dayHeaderFormat')}
      </div>
      {events.map((event, idx) => (
        <EventCell
          key={idx}
          type="popup"
          localizer={localizer}
          event={event}
          getters={getters}
          onSelect={onSelect}
          accessors={accessors}
          components={components}
          onDoubleClick={onDoubleClick}
          onKeyPress={onKeyPress}
          continuesPrior={localizer.lt(accessors.end(event), slotStart, 'day')}
          continuesAfter={localizer.gte(accessors.start(event), slotEnd, 'day')}
          slotStart={slotStart}
          slotEnd={slotEnd}
          selected={isSelected(event, selected)}
          draggable={true}
          onDragStart={() => handleDragStart(event)}
          onDragEnd={() => show()}
        />
      ))}
    </div>
  )
}

const Popup = React.forwardRef((props, ref) => (
  <Pop {...props} popperRef={ref} />
))
Popup.propTypes = {
  accessors: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  selected: PropTypes.object,
  components: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  show: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
  slotStart: PropTypes.instanceOf(Date).isRequired,
  slotEnd: PropTypes.instanceOf(Date),
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  handleDragStart: PropTypes.func,
  style: PropTypes.object,
  offset: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
}
export default Popup
