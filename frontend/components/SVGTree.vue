<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style="fill: none"
    width="278.42975"
    height="558.16321"
    viewBox="0 0 139.21 279.08"
    :class="animationIn ? 'in' : 'out'"
  >
    <path
      d="M66.301494,270.96868C77.804494,185.56168 65.338494,97.630686000 63.108494,11.968686"
      class="trunk"
    ></path>
    <path
      d="M62.629974,9.8217056C60.556164,15.805846 58.258364,35.870051 46.108494,63.968686"
      class="left0"
    ></path>
    <path
      d="m 62.629974,9.8217056 c 2.41215,-6.960461 4.52125,5.1282924 21.47852,45.7799804"
      class="right0"
    ></path>
    <path
      d="M64.564494,81.92568600000001C58.405494000000004,92.825686 50.271494000000004,105.02468 39.108494,111.96868"
      class="left1"
    ></path>
    <path
      d="m 64.564494,81.925686 c 10.128,-17.932 0.607,18.141994 34.544,23.602994"
      class="right1"
    ></path>
    <path
      d="M67.12649400000001,126.58468C59.228494,142.05168 48.9394,153.57368 31.108494,161.96868"
      class="left2"
    ></path>
    <path
      d="m 67.126494,126.58468 c 4.608,-9.026 13.806,22.39 40.981996,29.304"
      class="right2"
    ></path>
    <path
      d="M73.744494,172.0186800 C71.343494,171.2386800 68.222494,179.86368000 67.498494,180.8696800 C62.002494,188.52168 53.580494,192.69568 44.790494,195.81368 C36.0244940000,198.91968 27.539494,201.7096800 18.108494,200.79068"
      class="left3"
    ></path>
    <path
      d="m 73.744494,172.01868 c 12.203,3.964 31.767996,27.259 53.363996,19.367"
      class="right3"
    ></path>
    <path
      d="M69.10849400000001,216.96868C50.344494,226.99668 32.490494,243.79268 8.1084945,235.94168"
      class="left4"
    ></path>
    <path
      d="m 71.108494,214.96868 c 7.42,20.859 42.799996,19.171 59.999996,12.544"
      class="right4"
    ></path>
  </svg>
</template>

<script setup lang="ts">
export interface SVGTreeProps {
  animationIn: boolean;
}
withDefaults(defineProps<SVGTreeProps>(), {
  animationIn: false,
});
</script>
<style scoped lang="scss">
@function branch($branch-duration, $length) {
  @return calc($branch-duration / $length * 15);
}

@mixin basic_class($class, $length, $duration) {
  .#{$class} {
    animation-delay: 0s;
    animation: in_#{$class} 0.125s ease-out normal forwards;
  }
}
@mixin muu($class, $length, $duration, $branch-duration, $branch) {
  .#{$class} {
    stroke-dashoffset: $length;
    stroke-dasharray: $length;

    animation: out_#{$class} $duration ease-out normal forwards;

    @if $branch {
      animation-delay: $duration;
      animation-duration: branch($branch-duration, $length);
    }
  }

  @keyframes in_#{$class} {
    from {
      stroke-dashoffset: 0;
      stroke-dasharray: $length;
    }
    to {
      stroke-dashoffset: $length;
      stroke-dasharray: $length;
    }
  }

  @keyframes out_#{$class} {
    from {
      stroke-dashoffset: $length;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
}

@mixin muu2($class) {
  .#{$class} {
    animation-name: in_#{$class};
  }
}

@mixin tree1($duration) {
  @include basic_class(trunk, 259.4061279296875, $duration);
  @include basic_class(left0, 56.71225357055664, $duration);
  @include basic_class(right0, 54.36085891723633, $duration);
  @include basic_class(left1, 39.78474807739258, $duration);
  @include basic_class(right1, 50.937076568603516, $duration);
  @include basic_class(left2, 51.52828598022461, $duration);
  @include basic_class(right2, 53.48910140991211, $duration);
  @include basic_class(left3, 66.30268859863281, $duration);
  @include basic_class(right3, 58.932861328125, $duration);
  @include basic_class(left4, 66.25408172607422, $duration);
  @include basic_class(right4, 67.06096649169922, $duration);
}
@mixin tree1_in($duration, $branch-duration) {
  @include muu(trunk, 259.4061279296875, $duration, $branch-duration, false);
  @include muu(
    left0,
    56.71225357055664,
    $duration * 0.85,
    $branch-duration,
    true
  );
  @include muu(
    right0,
    54.36085891723633,
    $duration * 0.85,
    $branch-duration,
    true
  );
  @include muu(
    left1,
    39.78474807739258,
    $duration * 0.55,
    $branch-duration,
    true
  );
  @include muu(
    right1,
    50.937076568603516,
    $duration * 0.55,
    $branch-duration,
    true
  );
  @include muu(
    left2,
    51.52828598022461,
    $duration * 0.38,
    $branch-duration,
    true
  );
  @include muu(
    right2,
    53.48910140991211,
    $duration * 0.38,
    $branch-duration,
    true
  );
  @include muu(
    left3,
    66.30268859863281,
    $duration * 0.25,
    $branch-duration,
    true
  );
  @include muu(
    right3,
    58.932861328125,
    $duration * 0.25,
    $branch-duration,
    true
  );
  @include muu(
    left4,
    66.25408172607422,
    $duration * 0.125,
    $branch-duration,
    true
  );
  @include muu(
    right4,
    67.06096649169922,
    $duration * 0.125,
    $branch-duration,
    true
  );
}

@mixin tree1_out() {
  @include muu2(trunk);
  @include muu2(left0);
  @include muu2(right0);
  @include muu2(left1);
  @include muu2(right1);
  @include muu2(left2);
  @include muu2(right2);
  @include muu2(left3);
  @include muu2(right3);
  @include muu2(left4);
  @include muu2(right4);
}

.in {
  @include tree1(10.25);
}

.out {
  @include tree1_in(0.25s, 3s);
}

svg {
  //
  width: 100%;

  path {
    //stroke: $light;
    stroke-opacity: 1;
    stroke-width: 16;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
