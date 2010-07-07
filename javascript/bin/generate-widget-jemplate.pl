#!/usr/bin/perl
# @COPYRIGHT@
use strict;
use warnings;
use YAML;
use Template;
use Getopt::Long;

sub usage {
    my $usage = <<'...';
Usage:

    g-w-j.pl --yaml=<file> --output=<jemplate_file>

...
    $usage .= shift if @_;
    return $usage;
}

my $yaml_file = '';
my $output_file = '';
my $kind = '';
my $type = '';
my $template = '';

GetOptions(
    'yaml=s' => \$yaml_file,
    'output=s' => \$output_file,
    'template=s' => \$template,
);

die usage() unless $yaml_file;
die usage() unless $output_file;

if ($output_file =~ /^jemplate\/widget_(\w+)_(\w+)\.html$/) {
    ($type, $kind) = ($1, $2);
}

my $yaml_data = YAML::LoadFile($yaml_file);
my $widget_data = $yaml_data->{widget} or die;

# die usage() unless $widget_data->{$type};
# die usage() unless $widget_data->{$type};

my $tt2 = Template->new({
    START_TAG => '<!',
    END_TAG => '!>',
    INCLUDE_PATH => ['template'],
});

my $widget = $widget_data->{$type};

my @required = defined $widget->{required}
  ? (@{$widget->{required}})
  : defined $widget->{field}
    ? ($widget->{field})
    : ();
my %required = map {($_, 1)} @required;
my $data = {
    type => $type,
    data => $yaml_data,
    widget => $widget,
    fields =>
        $widget->{field} ? [$widget->{field}] :
        $widget->{fields} ? $widget->{fields} :
        [],
    pdfields => $widget->{pdfields},
    required => \%required,
    menu_hierarchy => $yaml_data->{menu_hierarchy},
};

print "Generating $output_file\n";
$tt2->process($template, $data, $output_file) || die $tt2->error(), "\n";
