import anime from "animejs";

const Animator = (() => {
  const createTimeline = () => {
    const animation = anime.timeline({
      autoplay: false,
    });

    const addClip = ({
      begin,
      update,
      complete,
      duration,
      easing,
      timeOffset,
    }) => {
      animation.add(
        {
          duration: duration || 1e3,
          easing: easing || "linear",
          update: (anim) => {
            update(anim.progress / 1e2);
          },
          begin: begin,
          complete: complete,
        },
        timeOffset
      );
    };

    const play = () => {
      animation.play();
    };

    return {
      finished: animation.finished,
      addClip,
      play,
    };
  };

  return {
    createTimeline,
  };
})();

export default Animator;
