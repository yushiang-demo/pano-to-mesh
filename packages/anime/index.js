import anime from "animejs";

const Animator = (() => {
  const createTimeline = () => {
    const animation = anime.timeline({
      autoplay: false,
    });

    const addClip = ({ begin, update, complete, duration, easing }) => {
      animation.add({
        duration: duration || 1e3,
        easing: easing || "linear",
        update: (anim) => {
          update(anim.progress / 1e2);
        },
        begin: begin,
        complete: complete,
      });
    };

    const play = () => {
      animation.play();
    };

    return {
      addClip,
      play,
    };
  };

  return {
    createTimeline,
  };
})();

export default Animator;
