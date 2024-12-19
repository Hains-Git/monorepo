import React from 'react';

import { throttle } from '../tools/debounce';

let gridWrapper = null;
let scrollWindowDiv = null;
const SCROLL_COUNT = 16;
const GAP = 150;
const DELAY = 500;

const dragEmployee = throttle((e) => {
  if (!gridWrapper) return;
  const gridWrapperPos = gridWrapper.getBoundingClientRect();

  const elemY = e._ffix_cy || e.clientY;
  const elemX = e._ffix_cx || e.clientX;

  const bottomEdge = gridWrapperPos.bottom - GAP + 50;
  const topEdge = gridWrapperPos.top + GAP - 100;
  const leftEdge = gridWrapperPos.left + GAP;
  const rightEdge = gridWrapperPos.width - GAP;

  const displayTop = elemY < topEdge;
  const displayBottom = elemY > bottomEdge;
  const displayLeft = elemX < leftEdge;
  const displayRight = elemX > rightEdge;

  const diffTop = Math.abs(elemY - topEdge);
  const diffBottom = Math.abs(elemY - bottomEdge);
  const diffLeft = Math.abs(elemX - leftEdge);
  const diffRight = Math.abs(elemX - rightEdge);

  const isDragingTop = diffTop < diffBottom;
  const isDragingDown = diffBottom < diffTop;
  const isDragingLeft = diffLeft < diffRight;
  const isDragingRight = diffRight < diffLeft;

  scrollWindowDiv.classList.remove('bottom');
  scrollWindowDiv.classList.remove('top');
  scrollWindowDiv.classList.remove('left');
  scrollWindowDiv.classList.remove('right');

  scrollWindowDiv.style.display = 'none';

  if (isDragingTop) {
    if (displayTop) {
      scrollWindowDiv.style.display = 'flex';
      scrollWindowDiv.style.top = `${gridWrapperPos.top + 20}px`;
      scrollWindowDiv.classList.add('top');
    }
  } else if (isDragingDown) {
    if (displayBottom) {
      scrollWindowDiv.style.display = 'flex';
      scrollWindowDiv.style.removeProperty('top');
      scrollWindowDiv.classList.add('bottom');
    }
  }
  if (isDragingLeft) {
    if (displayLeft) {
      scrollWindowDiv.style.display = 'flex';
      scrollWindowDiv.style.removeProperty('top');
      scrollWindowDiv.classList.add('left');
    }
  } else if (isDragingRight) {
    if (displayRight) {
      scrollWindowDiv.style.display = 'flex';
      scrollWindowDiv.style.removeProperty('top');
      scrollWindowDiv.classList.add('right');
    }
  }
  // console.log({ topEdge, bottomEdge, leftEdge, rightEdge, elemX, elemY });
}, DELAY);

const hideAll = throttle((e) => {
  e.preventDefault();
  scrollWindowDiv.style.display = 'none';
  scrollWindowDiv.classList.remove('active');
  scrollWindowDiv.classList.remove('top');
  scrollWindowDiv.classList.remove('bottom');
  scrollWindowDiv.classList.remove('left');
}, DELAY);

const dragStart = (e) => {
  const target = e.target;
  if (target.closest('.not-allocated')) {
    const mitarbeiterId = target.dataset.mid;
    e.dataTransfer.setData('mitarbeiterId', mitarbeiterId);
    return;
  }
  if (target.closest('.po-dienst-row')) {
    const mitarbeiterId = target.dataset.mid;
    const einteilungsId = target.dataset.eid;
    const funktionId = target.dataset.fid;

    e.dataTransfer.setData('funktion_id', funktionId);
    e.dataTransfer.setData('einteilungsId', einteilungsId);
    e.dataTransfer.setData('mitarbeiterId', mitarbeiterId);
  }
};

export const useScrollWindow = () => {
  React.useEffect(() => {
    gridWrapper = document.querySelector('div.daycol-wrapper');
    scrollWindowDiv = document.querySelector('div.scrolling-window');
    window.addEventListener('drag', dragEmployee);
    window.addEventListener('dragend', hideAll);
    window.addEventListener('dragstart', dragStart);

    return () => {
      window.removeEventListener('drag', dragEmployee);
      window.removeEventListener('dragend', hideAll);
      window.removeEventListener('dragstart', dragStart);
      gridWrapper = null;
    };
  }, []);

  const scrollThrough = (e) => {
    e.preventDefault();
    const scrollingBox = scrollWindowDiv;
    scrollingBox.classList.add('active');

    let scrollTop = 0;
    let scrollLeft = 0;
    const grid = document.querySelector('div.daycol-wrapper');
    let direction = '';

    if (scrollingBox.classList.contains('bottom')) {
      scrollTop = parseInt(grid.scrollTop + SCROLL_COUNT, 10);
      direction = 'block';
    }
    if (scrollingBox.classList.contains('top')) {
      scrollTop = parseInt(grid.scrollTop - SCROLL_COUNT, 10);
      direction = 'block';
    }

    if (scrollingBox.classList.contains('left')) {
      scrollLeft = parseInt(grid.scrollLeft - SCROLL_COUNT, 10);
      direction = 'inline';
    }
    if (scrollingBox.classList.contains('right')) {
      scrollLeft = parseInt(grid.scrollLeft + SCROLL_COUNT, 10);
      direction = 'inline';
    }

    if (
      direction === 'block' &&
      (scrollTop <= 0 || scrollTop >= grid.scrollTopMax)
    ) {
      return;
    }

    if (direction === 'block') {
      grid.scroll({
        top: scrollTop
      });
    }
    if (
      direction === 'inline' &&
      (scrollLeft <= 0 || scrollLeft >= grid.scrollLeftMax)
    ) {
      return;
    }

    if (direction === 'inline') {
      grid.scroll({
        left: scrollLeft
      });
    }
  };

  const dragLeave = (e) => {
    e.preventDefault();
    const scrollingBox = e.target.closest('div.scrolling-window');
    scrollingBox.classList.remove('active');
  };

  return {
    hideAll,
    scrollThrough,
    dragLeave
  };
};
